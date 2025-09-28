package logic

import (
	"context"

	"github.com/example/ai-chatbot/backend/internal/svc"
)

type HistoryResponse struct {
	Data string `json:"data"`
}

type HistoryLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewHistoryLogic(ctx context.Context, svcCtx *svc.ServiceContext) *HistoryLogic {
	return &HistoryLogic{ctx: ctx, svcCtx: svcCtx}
}

func (l *HistoryLogic) History() (*HistoryResponse, error) {
	// TODO: implement database queries
	return &HistoryResponse{Data: "history"}, nil
}
