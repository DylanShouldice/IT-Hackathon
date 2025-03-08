package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"sync"

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
	Gender      string `json:"gender"`
	Privacy     int    `json:"privacy"`
	Goal        string `json:"goal"`
	Id          int
	FoodEntries []FoodEntry
}

var store = sessions.NewCookieStore([]byte(os.Getenv("SESSION_KEY")))

func NewServer() *Server {
	return &Server{
		Users:    make(map[string]*User),
		Limiters: make(map[string]*rate.Limiter),
		data:     ConnectToDB(),
	}
}

func authMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		session, err := store.Get(r, "session-name")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		if auth, ok := session.Values["authenticated"].(bool); !ok || !auth {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		next.ServeHTTP(w, r)
	})
}

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

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "Failed to hash password", http.StatusInternalServerError)
		return
	}

	fmt.Fprintf(w, "User registered successfully")

	user.Password = string(hashedPassword)
	server.clients++
	user.Id = server.clients
	writeUserData(user, server.data)

}

func loginHandler(w http.ResponseWriter, r *http.Request) {
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

	hashedPasswordFromDB := []byte("example_hashed_password") //replace with your DB query.

	err = bcrypt.CompareHashAndPassword(hashedPasswordFromDB, []byte(user.Password))
	if err != nil {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	session, err := store.Get(r, "session-name")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	session.Values["authenticated"] = true
	session.Values["username"] = user.Email
	session.Save(r, w)

	fmt.Fprintf(w, "Login successful")
}

func protectedHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Protected resource accessed")
}

func StartServer(s *Server) {
	mux := http.NewServeMux()
	mux.HandleFunc("/register", registerHandler)
	mux.HandleFunc("/login", loginHandler)
	mux.Handle("/protected", authMiddleware(http.HandlerFunc(protectedHandler)))

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Hello, World!")
	})

	handler := cors.Default().Handler(mux)
	defer server.data.Close()

	http.ListenAndServe(serverConfig.Port, handler)

}
