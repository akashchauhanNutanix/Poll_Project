package main

import (
	"backend/models"
	"encoding/json"

	"log"
	"net/http"
	"strconv"

	"github.com/jinzhu/copier"
	"github.com/julienschmidt/httprouter"
)

type jsonResp struct {
	OK      bool   `json:"ok`
	Message string `json:"message"`
}

func (app *application) getOnePoll(w http.ResponseWriter, r *http.Request) {
	params := httprouter.ParamsFromContext(r.Context())

	id := (params.ByName("id"))

	// if err != nil {
	// 	app.logger.Print(errors.New("invalid id parameter"))
	// 	app.errorJSON(w, err)
	// 	return
	// }

	poll, err := app.models.DB.Get(id)

	err = app.writeJSON(w, http.StatusOK, poll, "poll")

	if err != nil {
		app.errorJSON(w, err)
		return
	}
}

func (app *application) getAllPolls(w http.ResponseWriter, r *http.Request) {
	polls, err := app.models.DB.All()
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	err = app.writeJSON(w, http.StatusOK, polls, "polls")
	if err != nil {
		app.errorJSON(w, err)
		return
	}
}

func (app *application) getAllCategories(w http.ResponseWriter, r *http.Request) {
	categories, err := app.models.DB.CategoriesAll()
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	err = app.writeJSON(w, http.StatusOK, categories, "categories")
	if err != nil {
		app.errorJSON(w, err)
		return
	}
}

func (app *application) getAllPollsByCategory(w http.ResponseWriter, r *http.Request) {
	params := httprouter.ParamsFromContext(r.Context())

	categoryID, err := strconv.Atoi(params.ByName("category_id"))
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	polls, err := app.models.DB.All(categoryID)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	err = app.writeJSON(w, http.StatusOK, polls, "polls")
	if err != nil {
		app.errorJSON(w, err)
		return
	}

}

func (app *application) createPoll(w http.ResponseWriter, r *http.Request) {
	var payload PollPayload

	err := json.NewDecoder(r.Body).Decode(&payload)
	if err != nil {
		log.Println(err)
		app.errorJSON(w, err)
		return
	}

	var poll models.Poll

	poll.ID = payload.ID
	poll.Ques = payload.Ques

	user1 := new([]Poll_PollOptionsPayload)
	req1 := new([]models.Poll_PollOptions)

	user1 = &payload.Poll_PollOption
	copier.Copy(req1, user1)

	poll.Poll_PollOptions = *req1
	// log.Println(payload.PollCategory)
	user2 := new([]PollCategoryPayload)
	req2 := new([]models.PollCategory)

	user2 = &payload.PollCategory
	copier.Copy(req2, user2)

	poll.PollCategory = *req2
	// log.Println(poll.PollCategory)
	err = app.models.DB.InsertPoll(poll)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	ok := jsonResp{
		OK: true,
	}

	err = app.writeJSON(w, http.StatusOK, ok, "response")
	if err != nil {
		app.errorJSON(w, err)
		return
	}
}

type PollPayload struct {
	ID              string                    `json:"id"`
	Ques            string                    `json:"ques"`
	Poll_PollOption []Poll_PollOptionsPayload `json:"options"`
	PollCategory    []PollCategoryPayload     `json:"category"`
}

type PollOptionsPayload struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	OgPollID string `json:"ogpollid"`
	Votes    int    `json:"votes"`
	Count    int    `json:"count"`
}
type Poll_PollOptionsPayload struct {
	ID            string             `json:"id"`
	PollID        string             `json:"poll_id"`
	PollOptionsID string             `json:"polloptions_id"`
	PollOptions   PollOptionsPayload `json:"polloptions"`
}

type PollCategoryPayload struct {
	ID         int             `json:"id"`
	PollID     string          `json:"poll_id"`
	CategoryID int             `json:"category_id"`
	Category   CategoryPayload `json:"category"`
}

type CategoryPayload struct {
	ID           int    `json:"id"`
	CategoryName string `json:"category_name"`
}
