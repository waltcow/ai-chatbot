package handler

import (
	"net/http"

	"github.com/zeromicro/go-zero/rest/httpx"

	"github.com/example/ai-chatbot/backend/internal/logic"
	"github.com/example/ai-chatbot/backend/internal/svc"
)

func suggestionsHandler(ctx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		l := logic.NewSuggestionsLogic(r.Context(), ctx)
		resp, err := l.List()
		if err != nil {
			httpx.Error(w, err)
		} else {
			httpx.OkJson(w, resp)
		}
	}
}
