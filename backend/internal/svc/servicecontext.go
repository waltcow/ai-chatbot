package svc

import (
	"github.com/zeromicro/go-zero/core/stores/sqlx"

	"github.com/example/ai-chatbot/backend/internal/config"
)

type ServiceContext struct {
	Config config.Config
	DB     sqlx.SqlConn
}

func NewServiceContext(c config.Config) *ServiceContext {
	conn := sqlx.NewPostgres(c.Database.DSN)
	return &ServiceContext{
		Config: c,
		DB:     conn,
	}
}
