package server

import (
	"github.com/SamixDev/seek/model"
	"gorm.io/gorm"
)

type RecommendedAccount struct {
	Address string `json:"address"`
	Reason  string `json:"reason"`
}

// function to get thoughts of accounts who are followed by the user
func (s *Server) GetFollowedThoughts(user string) ([]model.Thought, error) {

	limit := 10
	offset := 0
	var thought []model.Thought
	thought = make([]model.Thought, 0)
	var query string

	query = "SELECT * FROM thoughts where creator = ? union all SELECT * FROM thoughts where creator "
	query += "in (select \"following\" from follows where follower = ?) order by creation_date desc limit ? offset ?"

	err := s.dbClient.Raw(query, user, user, limit, offset).Scan(&thought)
	if err.Error != nil && err.Error != gorm.ErrRecordNotFound {
		return thought, err.Error
	}

	return thought, nil
}

// function to get a specific user's thoughts
func (s *Server) GetUserThoughts(user string) ([]model.Thought, error) {

	limit := 10
	offset := 0
	var thought []model.Thought
	thought = make([]model.Thought, 0)
	var query string

	query = "SELECT * FROM thoughts where creator = ? order by creation_date desc limit ? offset ?"

	err := s.dbClient.Raw(query, user, limit, offset).Scan(&thought)
	if err.Error != nil && err.Error != gorm.ErrRecordNotFound {
		return thought, err.Error
	}

	return thought, nil
}

// function to get recommended accounts for the user
func (s *Server) GetRecommemdedAccounts(user string) ([]RecommendedAccount, error) {

	limit := 5
	offset := 0
	var accounts []RecommendedAccount
	accounts = make([]RecommendedAccount, 0)
	var query string

	query = "select \"following\" as address, concat(count(\"following\"),' follower(s) in common') as reason from follows "
	query += "where follower in (select \"following\" from follows where follower = ?) and \"following\" not in "
	query += "(select \"following\" from follows where follower = ?) group by \"following\" ORDER BY RANDOM() limit ? offset ?"

	err := s.dbClient.Raw(query, user, user, limit, offset).Scan(&accounts)
	if err.Error != nil && err.Error != gorm.ErrRecordNotFound {
		return accounts, err.Error
	}

	// if the query returns no results, then we get the accounts with most followers
	if len(accounts) == 0 {
		query = "select \"following\" as address , concat('This profile has ',count(follower),' follower(s)') as reason "
		query += "from follows group by \"following\" ORDER BY count(follower) desc limit ? offset ?"
		err := s.dbClient.Raw(query, limit, offset).Scan(&accounts)
		if err.Error != nil && err.Error != gorm.ErrRecordNotFound {
			return accounts, err.Error
		}
	}

	return accounts, nil
}
