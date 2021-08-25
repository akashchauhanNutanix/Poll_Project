package main

import (
	"net/http"

	"github.com/julienschmidt/httprouter"
)

func (app *application) routes() http.Handler {
	router := httprouter.New()

	router.HandlerFunc(http.MethodGet, "/status", app.statusHandler)

	router.HandlerFunc(http.MethodGet, "/v1/poll/:id", app.getOnePoll)
	router.HandlerFunc(http.MethodGet, "/v1/polls", app.getAllPolls)
	router.HandlerFunc(http.MethodGet, "/v1/polls/:category_id", app.getAllPollsByCategory)
	router.HandlerFunc(http.MethodGet, "/v1/categories", app.getAllCategories)
	router.HandlerFunc(http.MethodPost, "/v1/create", app.createPoll)
	return app.enableCORS(router)
}
