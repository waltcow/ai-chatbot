package handler

import (
	"net/http"

	"github.com/zeromicro/go-zero/rest"

	"github.com/example/ai-chatbot/backend/internal/svc"
)

func RegisterHandlers(server *rest.Server, ctx *svc.ServiceContext) {
	routes := []rest.Route{
		{
			Method:  http.MethodGet,
			Path:    "/api/history",
			Handler: historyHandler(ctx),
		},
		{
			Method:  http.MethodGet,
			Path:    "/api/document",
			Handler: documentGetHandler(ctx),
		},
		{
			Method:  http.MethodPost,
			Path:    "/api/document",
			Handler: documentPostHandler(ctx),
		},
		{
			Method:  http.MethodDelete,
			Path:    "/api/document",
			Handler: documentDeleteHandler(ctx),
		},
		{
			Method:  http.MethodPost,
			Path:    "/api/files/upload",
			Handler: uploadHandler(ctx),
		},
		{
			Method:  http.MethodGet,
			Path:    "/api/suggestions",
			Handler: suggestionsHandler(ctx),
		},
		{
			Method:  http.MethodGet,
			Path:    "/api/vote",
			Handler: voteGetHandler(ctx),
		},
		{
			Method:  http.MethodPatch,
			Path:    "/api/vote",
			Handler: votePatchHandler(ctx),
		},
	}

	server.AddRoutes(routes)
}
