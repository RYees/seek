package server

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type JsonResponse struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data"`
	Message string      `json:"message"`
}

func Health(c *gin.Context) {

	c.JSON(http.StatusOK, gin.H{
		"status": "OK",
	})
}

func (s *Server) Feed(c *gin.Context) {

	d, err := s.GetFollowedThoughts(c.Params.ByName("user"))

	if err != nil {
		res := JsonResponse{
			Success: false,
			Data:    nil,
			Message: err.Error(),
		}
		c.JSON(http.StatusInternalServerError, res)
		return
	}
	res := JsonResponse{
		Success: true,
		Data:    d,
		Message: "Data retrieved successfully",
	}
	c.JSON(http.StatusOK, res)

}

func (s *Server) Posts(c *gin.Context) {

	d, err := s.GetUserThoughts(c.Params.ByName("user"))

	if err != nil {
		res := JsonResponse{
			Success: false,
			Data:    nil,
			Message: err.Error(),
		}
		c.JSON(http.StatusInternalServerError, res)
		return
	}
	res := JsonResponse{
		Success: true,
		Data:    d,
		Message: "Data retrieved successfully",
	}
	c.JSON(http.StatusOK, res)

}

func (s *Server) Recommended(c *gin.Context) {

	d, err := s.GetRecommemdedAccounts(c.Params.ByName("user"))

	if err != nil {
		res := JsonResponse{
			Success: false,
			Data:    nil,
			Message: err.Error(),
		}
		c.JSON(http.StatusInternalServerError, res)
		return
	}
	res := JsonResponse{
		Success: true,
		Data:    d,
		Message: "Data retrieved successfully",
	}
	c.JSON(http.StatusOK, res)

}
