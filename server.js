const mysql = require('mysql2');
const readline = require('readline');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'R@hman2051423',
  database: 'kfupm'
});

// Read user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function displayMenu() {
  console.log(`Hello,
choose from the following by entering the number:
1. Login
2. Continue as guest
3. Exit`);
}

function displayAdminMenu() {
    console.log(`Welcome, Tournament Admin!\nChoose from the following functions:
  1. Add a new tournament
  2. Add a team to a tournament
  3. Select a captain for a team
  4. Approve a player to join a team
  5. Delete a tournament
  6. Logout`);
  }



function login() {
  rl.question('Enter your username: ', (username) => {
    // Check if the username exists in the database
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.query(sql, [username], (err, results) => {
      if (err) {
        console.error('Error executing query: ', err);
        rl.close(); // Close readline interface
        db.end(); // Close database connection
        return;
      }
 
      if (results.length > 0) {
        rl.question('Enter your password: ', (password) => {
          const user = results[0];
          if (password === user.password) {
            console.log('Login successful!');
            displayAdminMenu(); // Show the admin menu
            handleAdminChoice(); // Handle admin's choice
          } else {
            console.log('Incorrect password. Login failed.');
            login(); // Restart the login process
          }
        });
      } else {
        console.log('Invalid username. Login failed.');
        displayMenu(); // Show the menu again
        handleChoice(); // Handle user's choice
      }
    });
  });
}

function handleChoice() {
  rl.question('Enter your choice: ', (choice) => {
    switch (choice) {
      case '1':
        // Process login
        login();
        break;
      case '2':
        // Process continuing as a guest
        console.log('Continuing as a guest...');
        rl.close(); // Close readline interface
        db.end(); // Close database connection
        break;
      case '3':
        // Exit the program
        console.log('Exiting...');
        rl.close(); // Close readline interface
        db.end(); // Close database connection
        break;
      default:
        console.log('Invalid choice.');
        displayMenu(); // Show the menu again
        handleChoice(); // Handle user's choice
        break;
    }
  });
}

function addNewTournament() {
    console.log('Add a new tournament');
  
    rl.question('Enter the tournament ID: ', (tournamentId) => {
      rl.question('Enter the tournament name: ', (tournamentName) => {
        rl.question('Enter the start date (YYYY-MM-DD): ', (startDate) => {
          rl.question('Enter the end date (YYYY-MM-DD): ', (endDate) => {
            const sql = 'INSERT INTO tournament (tr_id, tr_name, start_date, end_date) VALUES (?, ?, ?, ?)';
            db.query(sql, [tournamentId, tournamentName, startDate, endDate], (err, results) => {
              if (err) {
                console.error('Error executing query: ', err);
                return;
              }
  
              console.log('Tournament added successfully!');
  
              // After adding the tournament, you may want to display the admin menu again
              displayAdminMenu();
              handleAdminChoice();
            });
          });
        });
      });
    });
  }
  
  
  
  function addTeamToTournament() {
    // Implement the functionality to add a team to a tournament
    console.log('Add a team to a tournament');
    // Add your code here
  }
  
  function selectCaptainForTeam() {
    // Implement the functionality to select a captain for a team
    console.log('Select a captain for a team');
    // Add your code here
  }
  
  function approvePlayerToJoinTeam() {
    // Implement the functionality to approve a player to join a team
    console.log('Approve a player to join a team');
    // Add your code here
  }
  
  function deleteTournament() {
    // Implement the functionality to delete a tournament
    console.log('Delete a tournament');
    // Add your code here
  }
  
  function handleAdminChoice() {
    rl.question('Enter your choice: ', (choice) => {
      switch (choice) {
        case '1':
          addNewTournament();
          break;
        case '2':
          addTeamToTournament();
          break;
        case '3':
          selectCaptainForTeam();
          break;
        case '4':
          approvePlayerToJoinTeam();
          break;
        case '5':
          deleteTournament();
          break;
        case '6':
          logout();
          break;
        default:
          console.log('Invalid choice.');
          displayAdminMenu();
          handleAdminChoice();
          break;
      }
    });
  }
  
  function logout() {
    console.log('Logging out...');
    displayMenu();
    handleChoice();
  }  

// Start the program
displayMenu();
handleChoice();