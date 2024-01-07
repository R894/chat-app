package testdata

import (
	"context"
	"go-chatserver/internal/auth"
	"go-chatserver/internal/database"
	"go-chatserver/internal/repository"
	"log"
)

// SetupTestDatabase sets up a test mongoDB database
func SetupTestDatabase() (*repository.Repository, func()) {
	// initialize the test database connection
	db, err := database.Init()
	if err != nil {
		log.Fatal("Error initializing test database:", err)
	}

	// create a repository with the test database
	repo := repository.NewRepository(db.Database("test"))

	// insert test data
	seedTestData(repo)

	// return a cleanup function to be executed after the tests
	cleanup := func() {
		err := db.Database("test").Drop(context.TODO())
		if err != nil {
			log.Fatal("Error dropping test database:", err)
		}

		err = db.Disconnect(context.TODO())
		if err != nil {
			log.Fatal("Error disconnecting from the database:", err)
		}
	}

	return repo, cleanup
}

func seedTestData(repo *repository.Repository) {
	johnPassword, _ := auth.HashPassword("johndoe")
	maryPassword, _ := auth.HashPassword("marysue")
	repo.Users.InsertUser(context.TODO(), repository.RegisterUserRequest{Name: "John", Email: "johndoe@gmail.com", Password: johnPassword})
	repo.Users.InsertUser(context.TODO(), repository.RegisterUserRequest{Name: "Mary", Email: "marysue@gmail.com", Password: maryPassword})

	john, err := repo.Users.FindByEmail(context.TODO(), "johndoe@gmail.com")
	if err != nil {
		log.Fatal(err)
	}

	mary, err := repo.Users.FindByEmail(context.TODO(), "marysue@gmail.com")
	if err != nil {
		log.Fatal(err)
	}

	repo.Users.InsertFriend(context.TODO(), john.ID.Hex(), mary.ID.Hex())
	repo.Users.InsertFriend(context.TODO(), mary.ID.Hex(), john.ID.Hex())
}
