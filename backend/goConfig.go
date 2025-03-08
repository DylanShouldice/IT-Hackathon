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
			Host:     v.GetString("db_host"),
			Port:     v.GetString("db_port"),
			Username: v.GetString("db_username"),
			Password: v.GetString("db_password"),
			DbName:   v.GetString("db_name"),
		},
	}
}
