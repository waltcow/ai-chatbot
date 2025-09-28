package logic

import (
	"context"

	"github.com/example/ai-chatbot/backend/internal/svc"
)

type SuggestionsLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewSuggestionsLogic(ctx context.Context, svcCtx *svc.ServiceContext) *SuggestionsLogic {
	return &SuggestionsLogic{ctx: ctx, svcCtx: svcCtx}
}

func (l *SuggestionsLogic) List() (interface{}, error) {
	// TODO: implement fetching suggestions
	return map[string]string{"status": "suggestions"}, nil
}
