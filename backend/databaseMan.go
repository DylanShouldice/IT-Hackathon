package main

import (
	"database/sql"
	"fmt"
	"strconv"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

type NutritionValues struct {
	// will hold the nutritional values of the food.
}

type FoodEntry struct {
	ID        int       `json:"id"`
	FoodName  string    `json:"food_name"`
	Calories  int       `json:"calories"`
	TimeStamp time.Time `json:"timestamp"`
}

type Meal struct {
	ID          int    `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

type WeighIn struct {
	ID        int       `json:"id"`
	Weight    int       `json:"weight"`
	Exersice  int       `json:"exersice"`
	UserID    int       `json:"userID"`
	TimeStamp time.Time `json:"timestamp"`
}

func ConnectToDB() *sql.DB {
	dsn := serverConfig.Db.Username + ":" + serverConfig.Db.Password + "@tcp(" + serverConfig.Db.Host + ":" + serverConfig.Db.Port + ")/" + serverConfig.Db.DbName
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		panic(err)
	}

	err = db.Ping()
	if err != nil {
		panic(err)
	}

	fmt.Println("Successfully connected to the database!")
	return db
}

func writeUserData(user User, db *sql.DB) {
	// write the user data to the database
	query := "INSERT INTO userdata (id, password, height, age, allergies, diet, privacy, goal, user) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
	_, err := db.Exec(query, user.Id, user.Password, user.Height, user.Age, user.Allergies, user.Diet, user.Privacy, user.Goal, user.Email)
	if err != nil {
		panic(err)
	}
}

func straightQuery(query string, db *sql.DB) sql.Result {
	res, err := db.Exec(query)
	if err != nil {
		panic(err)
	}
	fmt.Println(res)

	return res
}

func readUserData(id int, db *sql.DB) {
	// read the user data from the database
	query := "SELECT * FROM users WHERE id = " + strconv.Itoa(id)
	rows, err := db.Query(query)
	if err != nil {
		panic(err)
	}
	fmt.Println(rows)

}

func writeMeal(meal Meal, db *sql.DB) {

	query := "INSERT INTO meal (id, name, description) VALUES (?, ?, ?)"
	_, err := db.Exec(query, meal.ID, meal.Name, meal.Description)
	if err != nil {
		panic(err)
	}

}

// func testDatabase() {
// 	user := UserData{
// 		ID:        1,
// 		Password:  "password",
// 		Height:    5,
// 		age:       20,
// 		allergies: "none",
// 		diet:      "none",
// 		privacy:   true,
// 		goal:      "lose weight",
// 	}
// 	server.data = ConnectToDB()
// 	writeUserData(user, server.data)
// 	readUserData(1, server.data)
// }
