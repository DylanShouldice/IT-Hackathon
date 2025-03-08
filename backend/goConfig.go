package main

import (
	"github.com/spf13/viper"
)

type Config struct {
	v    *viper.Viper
	Host string
	Port string
	Db   DbConfig
}

type DbConfig struct {
	Host     string
	Port     string
	Username string
	Password string
	DbName   string
}

func NewConfig() *Config {
	v := viper.New()
	v.SetConfigName("config")
	v.AddConfigPath(".")
	v.SetConfigType("json")

	err := v.ReadInConfig()
	if err != nil {
		panic(err)
	}

	return &Config{
		v:    v,
		Host: v.GetString("host"),
		Port: v.GetString("port"),
		Db: DbConfig{
			Host:     v.GetString("Db.db_host"),
			Port:     v.GetString("Db.db_port"),
			Username: v.GetString("Db.db_user"),
			Password: v.GetString("Db.db_password"),
			DbName:   v.GetString("Db.db_name"),
		},
	}
}
