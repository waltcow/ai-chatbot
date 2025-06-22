package config

import "github.com/zeromicro/go-zero/rest"

type Config struct {
	rest.RestConf
	Host     string
	Port     int
	Database struct {
		DSN string
	}
}
