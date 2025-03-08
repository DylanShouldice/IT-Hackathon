package main

import (
	"time"
)

type NutritionValues struct {
	// will hold the nutritional values of the food.
}

type FoodEntry struct {
	ID        string    `json:"id"`
	FoodName  string    `json:"food_name"`
	Calories  int       `json:"calories"`
	TimeStamp time.Time `json:"timestamp"`
}
