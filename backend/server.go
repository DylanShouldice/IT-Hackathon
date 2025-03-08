package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"sync"
	"time"

	"github.com/dgrijalva/jwt-go"
	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/sessions"
	"github.com/rs/cors"
	"golang.org/x/crypto/bcrypt"
	"golang.org/x/time/rate"
)

type Server struct {
    Users      map[string]*User
    Limiters   map[string]*rate.Limiter
    APILimiter map[string]*rate.Limiter
    clients    int
    mu         sync.Mutex
    data       *sql.DB
}

type User struct {
    Password    string `json:"password"`
    Email       string `json:"email"`
    Height      string `json:"height"`
    Age         string `json:"age"`
    Allergies   string `json:"allergies"`
    Diet        string `json:"diet"`
    Privacy     int    `json:"privacy"`
    Goal        string `json:"goal"`
    Id          int
    FoodEntries []FoodEntry
}

var store = sessions.NewCookieStore([]byte("thejoes"))
var jwtKey = []byte(os.Getenv("JWT_SECRET"))

func generateJWT(userID int) (string, error) {
    expirationTime := time.Now().Add(24 * time.Hour)

    claims := &Claims{
        UserID: userID,
        StandardClaims: jwt.StandardClaims{
            ExpiresAt: expirationTime.Unix(),
        },
    }

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    return token.SignedString(jwtKey)
}

func NewServer() *Server {
    return &Server{
        Users:    make(map[string]*User),
        Limiters: make(map[string]*rate.Limiter),
        data:     ConnectToDB(),
    }
}

func authenticateJWT(next http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        tokenString := r.Header.Get("Authorization")

        if tokenString == "" {
            http.Error(w, "Missing token", http.StatusUnauthorized)
            return
        }

        // Remove "Bearer " prefix if present
        if len(tokenString) > 7 && tokenString[:7] == "Bearer " {
            tokenString = tokenString[7:]
        }

        claims := &Claims{}
        token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
            return jwtKey, nil
        })

        if err != nil || !token.Valid {
            http.Error(w, "Invalid token", http.StatusUnauthorized)
            return
        }

        // Store UserID in request context
        r.Header.Set("UserID", fmt.Sprintf("%d", claims.UserID))
        next(w, r)
    }
}

// Claims struct for JWT
type Claims struct {
    UserID int `json:"userId"`
    jwt.StandardClaims
}

// GetJWTSecret returns the JWT signing key from environment variable
func GetJWTSecret() []byte {
    secret := ("thejoes")
    if secret == "" {
        log.Fatal("JWT_SECRET environment variable is not set")
    }
    return []byte(secret)
}

// GenerateJWT creates a new JWT token for a user
func GenerateJWT(userID int) (string, error) {
    expirationTime := time.Now().Add(24 * time.Hour)

    claims := &Claims{
        UserID: userID,
        StandardClaims: jwt.StandardClaims{
            ExpiresAt: expirationTime.Unix(),
        },
    }

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    return token.SignedString(GetJWTSecret())
}

// AuthenticateJWT middleware verifies JWT tokens
func AuthenticateJWT(next http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        tokenString := r.Header.Get("Authorization")

        if tokenString == "" {
            http.Error(w, "Missing token", http.StatusUnauthorized)
            return
        }

        // Remove "Bearer " prefix if present
        if len(tokenString) > 7 && tokenString[:7] == "Bearer " {
            tokenString = tokenString[7:]
        }

        claims := &Claims{}
        token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
            // Validate signing method
            if token.Method != jwt.SigningMethodHS256 {
                return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
            }
            return GetJWTSecret(), nil
        })

        if err != nil {
            http.Error(w, "Invalid token", http.StatusUnauthorized)
            return
        }

        if !token.Valid {
            http.Error(w, "Token validation failed", http.StatusUnauthorized)
            return
        }

        // Store UserID in request context
        r.Header.Set("UserID", fmt.Sprintf("%d", claims.UserID))
        next(w, r)
    }
}

// Updated handler functions to use JWT authentication

// LoginHandler handles user login
func loginHandler(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodPost {
        http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
        return
    }

    var user struct {
        Email    string `json:"email"`
        Password string `json:"password"`
    }

    err := json.NewDecoder(r.Body).Decode(&user)
    if err != nil {
        http.Error(w, "Invalid request payload", http.StatusBadRequest)
        return
    }

    // Debug print statement for login attempt
    fmt.Println("Login attempt for user:", user.Email)

    var userID int
    var hashedPasswordFromDB string
    err = server.data.QueryRow("SELECT id, password FROM userdata WHERE user = ?", user.Email).Scan(&userID, &hashedPasswordFromDB)
    if err != nil {
        if err == sql.ErrNoRows {
            http.Error(w, "Invalid credentials", http.StatusUnauthorized)
            return
        }
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    // Debug print statement for password check
    fmt.Println("Hashed password from DB:", hashedPasswordFromDB)

    err = bcrypt.CompareHashAndPassword([]byte(hashedPasswordFromDB), []byte(user.Password))
    if err != nil {
        http.Error(w, "Invalid credentials", http.StatusUnauthorized)
        return
    }

    // Generate JWT Token
    token, err := GenerateJWT(userID)
    if err != nil {
        http.Error(w, "Could not generate token", http.StatusInternalServerError)
        return
    }

    // Send token in response
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(map[string]interface{}{
        "token":  token,
        "userId": userID,
    })
}

// RegisterHandler updates to return a JWT token on successful registration
func registerHandler(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodPost {
        http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
        return
    }

    var user User
    err := json.NewDecoder(r.Body).Decode(&user)
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    // Debug print statement for registration
    fmt.Println("Registering user:", user.Email)

    // Hash the password
    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
    if err != nil {
        http.Error(w, "Failed to hash password", http.StatusInternalServerError)
        return
    }

    // Debug print statement for hashed password
    fmt.Println("Hashed password:", string(hashedPassword))

    user.Password = string(hashedPassword)
    
    // Insert user into database
    result, err := server.data.Exec(
        "INSERT INTO userdata (user, password, height, age, allergies, diet, privacy, goal) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        user.Email, user.Password, user.Height, user.Age, user.Allergies, user.Diet, user.Privacy, user.Goal,
    )
    if err != nil {
        http.Error(w, "Database error: "+err.Error(), http.StatusInternalServerError)
        return
    }
    
    // Get the user ID
    userID, err := result.LastInsertId()
    if err != nil {
        http.Error(w, "Failed to get user ID", http.StatusInternalServerError)
        return
    }
    
    // Generate JWT token
    token, err := GenerateJWT(int(userID))
    if err != nil {
        http.Error(w, "Failed to generate token", http.StatusInternalServerError)
        return
    }

    // Return success with token
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(map[string]interface{}{
        "message": "User registered successfully",
        "token":   token,
        "userId":  userID,
    })
}

// WeighInHandler now uses the UserID from JWT
func weighInHandler(w http.ResponseWriter, r *http.Request) {
    userIDStr := r.Header.Get("UserID")
    if userIDStr == "" {
        http.Error(w, "User ID not found in request", http.StatusBadRequest)
        return
    }

    userID, err := strconv.Atoi(userIDStr)
    if err != nil {
        http.Error(w, "Invalid User ID", http.StatusBadRequest)
        return
    }

    if r.Method == http.MethodPost {
        var weighIn WeighIn
        err := json.NewDecoder(r.Body).Decode(&weighIn)
        if err != nil {
            http.Error(w, "Invalid JSON", http.StatusBadRequest)
            return
        }

        weighIn.UserID = userID
        weighIn.TimeStamp = time.Now()

        _, err = server.data.Exec("INSERT INTO weighins (weight, userid, timestamp) VALUES (?, ?, ?)", 
            weighIn.Weight, weighIn.UserID, weighIn.TimeStamp)
        if err != nil {
            http.Error(w, "Database error: "+err.Error(), http.StatusInternalServerError)
            return
        }

        w.WriteHeader(http.StatusCreated)
        fmt.Fprintf(w, "Weigh-in recorded successfully")
    }

    if r.Method == http.MethodGet {
        rows, err := server.data.Query("SELECT id, weight, timestamp FROM weighins WHERE userid = ? ORDER BY timestamp DESC", userID)
        if err != nil {
            http.Error(w, "Database error: "+err.Error(), http.StatusInternalServerError)
            return
        }
        defer rows.Close()

        var weighIns []WeighIn
        for rows.Next() {
            var weighIn WeighIn
            if err := rows.Scan(&weighIn.ID, &weighIn.Weight, &weighIn.TimeStamp); err != nil {
                http.Error(w, "Error scanning database: "+err.Error(), http.StatusInternalServerError)
                return
            }
            weighIn.UserID = userID
            weighIns = append(weighIns, weighIn)
        }

        if err := rows.Err(); err != nil {
            http.Error(w, "Error iterating rows: "+err.Error(), http.StatusInternalServerError)
            return
        }

        w.Header().Set("Content-Type", "application/json")
        json.NewEncoder(w).Encode(weighIns)
    }
}

// Add a new refresh token handler
func refreshTokenHandler(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodPost {
        http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
        return
    }

    userIDStr := r.Header.Get("UserID")
    if userIDStr == "" {
        http.Error(w, "User ID not found in request", http.StatusBadRequest)
        return
    }

    userID, err := strconv.Atoi(userIDStr)
    if err != nil {
        http.Error(w, "Invalid User ID", http.StatusBadRequest)
        return
    }

    // Generate a new token
    token, err := GenerateJWT(userID)
    if err != nil {
        http.Error(w, "Could not generate token", http.StatusInternalServerError)
        return
    }

    // Send token in response
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(map[string]string{"token": token})
}

func mealsHandler(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodGet {
        http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
        return
    }

    rows, err := server.data.Query("SELECT id, name, description FROM meals")
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    var meals []Meal
    for rows.Next() {
        var meal Meal
        if err := rows.Scan(&meal.ID, &meal.Name, &meal.Description); err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        meals = append(meals, meal)
    }

    if err := rows.Err(); err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(meals)
}

func protectedHandler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Protected resource accessed")
}

// Updated StartServer function with JWT routes
func StartServer(s *Server) {
    // Make sure JWT secret is set
    GetJWTSecret()
    
    mux := http.NewServeMux()
    
    // Public routes
    mux.HandleFunc("/register", registerHandler)
    mux.HandleFunc("/login", loginHandler)
    mux.HandleFunc("/meals", mealsHandler)
    
    // Protected routes with JWT authentication
    mux.HandleFunc("/weighIn", AuthenticateJWT(weighInHandler))
    mux.HandleFunc("/protected", AuthenticateJWT(protectedHandler))
    mux.HandleFunc("/refreshToken", AuthenticateJWT(refreshTokenHandler))

    mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        if r.URL.Path != "/" {
            http.NotFound(w, r)
            return
        }
        fmt.Fprintf(w, "API Server Running")
    })

    // Apply CORS middleware
    handler := cors.Default().Handler(mux)
    
    defer s.data.Close()
    log.Printf("Starting server on %s", serverConfig.Port)
    http.ListenAndServe(serverConfig.Port, handler)
}