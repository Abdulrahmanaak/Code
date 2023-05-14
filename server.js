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

function displayGuestMenu() {
    console.log(`Welcome, Guest!\nChoose from the following functions:
1. Browse all match results of a given tournament sorted by date
2. Browse the player with the highest goal scored in all the tournaments
3. Browse the players who received red cards in each team
4. Browse all members of a selected team including manager, coach, captain, and players`);
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
        displayGuestMenu(); // Show the guest menu
        handleGuestChoice();
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
      const checkSql = 'SELECT COUNT(*) AS count FROM tournament WHERE tr_id = ?';
      db.query(checkSql, [tournamentId], (checkErr, checkResults) => {
        if (checkErr) {
          console.error('Error executing query: ', checkErr);
          return;
        }
  
        const count = checkResults[0].count;
        if (count > 0) {
          console.log('Tournament ID already exists. Please choose a different ID.');
          addNewTournament();
          return;
        }
  
        rl.question('Enter the tournament name: ', (tournamentName) => {
          function askStartDate() {
            rl.question('Enter the start date (YYYY-MM-DD): ', (startDate) => {
              if (!isValidDate(startDate)) {
                console.log('Invalid start date format. Please enter a valid date (YYYY-MM-DD).');
                askStartDate();
                return;
              }
  
              askEndDate(startDate);
            });
          }
  
          function askEndDate(startDate) {
            rl.question('Enter the end date (YYYY-MM-DD): ', (endDate) => {
              if (!isValidDate(endDate)) {
                console.log('Invalid end date format. Please enter a valid date (YYYY-MM-DD).');
                askEndDate(startDate);
                return;
              }
  
              if (endDate < startDate) {
                console.log('End date cannot be before the start date. Please enter valid dates.');
                askEndDate(startDate);
                return;
              }
  
              const sql = 'INSERT INTO tournament (tr_id, tr_name, start_date, end_date) VALUES (?, ?, ?, ?)';
              db.query(sql, [tournamentId, tournamentName, startDate, endDate], (err, results) => {
                if (err) {
                  console.error('Error executing query: ', err);
                  return;
                }
  
                console.log('Tournament added successfully!');
  
                displayAdminMenu();
                handleAdminChoice();
              });
            });
          }
  
          askStartDate();
        });
      });
    });
  }
  
  function isValidDate(dateString) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(dateString);
  }
  
  function addTeamToTournament() {
    console.log('Add a team to a tournament');
  
    rl.question('Enter the tournament ID: ', (tournamentId) => {
      const checkTournamentSql = 'SELECT COUNT(*) AS count FROM tournament WHERE tr_id = ?';
      db.query(checkTournamentSql, [tournamentId], (tournamentErr, tournamentResults) => {
        if (tournamentErr) {
          console.error('Error executing query: ', tournamentErr);
          return;
        }
  
        const tournamentCount = tournamentResults[0].count;
        if (tournamentCount === 0) {
          console.log('Tournament does not exist. Please enter a valid tournament ID.');
          addTeamToTournament();
          return;
        }
  
        rl.question('Enter the team ID: ', (teamId) => {
          const checkTeamSql = 'SELECT COUNT(*) AS count FROM team WHERE team_id = ? AND tr_id = ?';
          db.query(checkTeamSql, [teamId, tournamentId], (teamErr, teamResults) => {
            if (teamErr) {
              console.error('Error executing query: ', teamErr);
              return;
            }
  
            const teamCount = teamResults[0].count;
            if (teamCount > 0) {
              console.log('Team already exists in the tournament. Please choose a different team ID.');
              addTeamToTournament();
              return;
            }
  
            rl.question('Enter the team group: ', (teamGroup) => {
              const sql = 'INSERT INTO team (team_id, tr_id, team_group, match_played, won, draw, lost, goal_for, goal_against, goal_diff, points, group_position) VALUES (?, ?, ?, 0, 0, 0, 0, 0, 0, 0, 0, 0)';
              db.query(sql, [teamId, tournamentId, teamGroup], (insertErr, insertResults) => {
                if (insertErr) {
                  console.error('Error executing query: ', insertErr);
                  return;
                }
  
                console.log('Team added to the tournament successfully!');
  
                displayAdminMenu();
                handleAdminChoice();
              });
            });
          });
        });
      });
    });
  }
  
  function selectCaptainForTeam() {
    console.log('Select a captain for a team');
  
    rl.question('Enter the match number: ', (matchNumber) => {
      rl.question('Enter the team ID: ', (teamId) => {
        rl.question('Enter the player ID for the captain: ', (playerId) => {
          const checkMatchSql = 'SELECT COUNT(*) AS count FROM match_played WHERE match_no = ?';
          const checkTeamSql = 'SELECT COUNT(*) AS count FROM team WHERE team_id = ?';
          const checkPlayerSql = 'SELECT COUNT(*) AS count FROM player WHERE player_id = ?';
  
          db.query(checkMatchSql, [matchNumber], (matchErr, matchResults) => {
            if (matchErr) {
              console.error('Error executing query: ', matchErr);
              return;
            }
  
            const matchCount = matchResults[0].count;
            if (matchCount === 0) {
              console.log('Match does not exist. Please enter a valid match number.');
              selectCaptainForTeam();
              return;
            }
  
            db.query(checkTeamSql, [teamId], (teamErr, teamResults) => {
              if (teamErr) {
                console.error('Error executing query: ', teamErr);
                return;
              }
  
              const teamCount = teamResults[0].count;
              if (teamCount === 0) {
                console.log('Team does not exist. Please enter a valid team ID.');
                selectCaptainForTeam();
                return;
              }
  
              db.query(checkPlayerSql, [playerId], (playerErr, playerResults) => {
                if (playerErr) {
                  console.error('Error executing query: ', playerErr);
                  return;
                }
  
                const playerCount = playerResults[0].count;
                if (playerCount === 0) {
                  console.log('Player does not exist. Please enter a valid player ID.');
                  selectCaptainForTeam();
                  return;
                }
  
                const insertSql = 'INSERT INTO match_captain (match_no, team_id, player_captain) VALUES (?, ?, ?)';
                db.query(insertSql, [matchNumber, teamId, playerId], (insertErr, insertResults) => {
                  if (insertErr) {
                    console.error('Error executing query: ', insertErr);
                    return;
                  }
  
                  console.log('Captain selected successfully for the team in the match!');
  
                  displayAdminMenu();
                  handleAdminChoice();
                });
              });
            });
          });
        });
      });
    });
  }
      
  function approvePlayerToJoinTeam() {
    console.log('Approve a player to join a team');
  
    rl.question('Enter the player ID: ', (playerId) => {
      rl.question('Enter the team ID: ', (teamId) => {
        const checkTeamSql = 'SELECT COUNT(*) AS count FROM team WHERE team_id = ?';
        const checkPlayerSql = 'SELECT COUNT(*) AS count FROM player WHERE player_id = ?';
        const addPlayerToTeamSql = 'INSERT INTO player (player_id, team_id, jersey_no, player_name, position_to_play, dt_of_bir) VALUES (?, ?, ?, ?, ?, ?)';
  
        db.query(checkTeamSql, [teamId], (teamErr, teamResults) => {
          if (teamErr) {
            console.error('Error executing query: ', teamErr);
            return;
          }
  
          const teamCount = teamResults[0].count;
          if (teamCount === 0) {
            console.log('Team does not exist. Please enter a valid team ID.');
            approvePlayerToJoinTeam();
            return;
          }
  
          db.query(checkPlayerSql, [playerId], (playerErr, playerResults) => {
            if (playerErr) {
              console.error('Error executing query: ', playerErr);
              return;
            }
  
            const playerCount = playerResults[0].count;
            if (playerCount > 0) {
              console.log('Player already exists. Please enter a new player ID.');
              approvePlayerToJoinTeam();
              return;
            }
  
            rl.question('Enter the player\'s jersey number: ', (jerseyNo) => {
              rl.question('Enter the player\'s name: ', (playerName) => {
                rl.question('Enter the player\'s position to play: ', (positionToPlay) => {
                  rl.question('Enter the player\'s date of birth (YYYY-MM-DD): ', (dateOfBirth) => {
                    const playerData = [playerId, teamId, jerseyNo, playerName, positionToPlay, dateOfBirth];
  
                    db.query(addPlayerToTeamSql, playerData, (addErr, addResults) => {
                      if (addErr) {
                        console.error('Error executing query: ', addErr);
                        return;
                      }
  
                      console.log('Player has been approved and added to the team successfully!');
  
                      displayAdminMenu();
                      handleAdminChoice();
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  }
          
  function deleteTournament() {
    console.log('Delete a tournament');
  
    rl.question('Enter the tournament ID: ', (tournamentId) => {
      // Check if the tournament ID is referenced in the team table
      const checkTeamSql = 'SELECT COUNT(*) AS references_count FROM team WHERE tr_id = ?';
      db.query(checkTeamSql, [tournamentId], (err, teamResults) => {
        if (err) {
          console.error('Error executing query: ', err);
          return;
        }
  
        const teamReferencesCount = teamResults[0].references_count;
  
        // Check if the tournament ID is referenced in the match_captain table
        const checkMatchCaptainSql = 'SELECT COUNT(*) AS references_count FROM match_captain WHERE match_no = ?';
        db.query(checkMatchCaptainSql, [tournamentId], (err, matchCaptainResults) => {
          if (err) {
            console.error('Error executing query: ', err);
            return;
          }
  
          const matchCaptainReferencesCount = matchCaptainResults[0].references_count;
  
          // Check if the tournament ID is referenced in the player table
          const checkPlayerSql = 'SELECT COUNT(*) AS references_count FROM player WHERE team_id = ?';
          db.query(checkPlayerSql, [tournamentId], (err, playerResults) => {
            if (err) {
              console.error('Error executing query: ', err);
              return;
            }
  
            const playerReferencesCount = playerResults[0].references_count;
  
            // If any references are found, display a message
            if (teamReferencesCount > 0 || matchCaptainReferencesCount > 0 || playerReferencesCount > 0) {
              console.log('Cannot delete the tournament. It is referenced in other tables.');
            } else {
              // No references found, proceed with deleting the tournament
              const deleteTournamentSql = 'DELETE FROM tournament WHERE tr_id = ?';
              db.query(deleteTournamentSql, [tournamentId], (err, deleteResults) => {
                if (err) {
                  console.error('Error executing query: ', err);
                  return;
                }
  
                if (deleteResults.affectedRows > 0) {
                  console.log('Tournament has been deleted successfully!');
                } else {
                  console.log('Tournament not found. Please enter a valid tournament ID.');
                }
              });
            }
  
            displayAdminMenu();
            handleAdminChoice();
          });
        });
      });
    });
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

  function handleGuestChoice() {
    rl.question('Enter your choice: ', (choice) => {
      switch (choice) {
        case '1':
          browseMatchResults();
          break;
        case '2':
          browseHighestGoalScorer();
          break;
        case '3':
          browseRedCardsByTeam();
          break;
        case '4':
          browseTeamMembers();
          break;
        default:
          console.log('Invalid choice.');
          displayGuestMenu();
          handleGuestChoice();
          break;
      }
    });
  }
  
  function browseMatchResults() {
    rl.question('Enter the tournament ID: ', (tournamentId) => {
      // Prepare the SQL query
      const sqlQuery = `
  SELECT md.*
  FROM match_details AS md
  JOIN team AS t ON t.team_id = md.team_id
  WHERE t.tr_id = ${tournamentId}
  ORDER BY md.match_no`;

  
      // Execute the SQL query
      db.query(sqlQuery, (error, results) => {
        if (error) {
          console.error('Error fetching match results:', error);
          displayGuestMenu();
          handleGuestChoice();
          return;
        }
  
        // Display the fetched match results
        console.log(`Browsing match results for tournament ID: ${tournamentId}`);
        results.forEach((result) => {
          console.log(`Match No: ${result.match_no}`);
          console.log(`Team ID: ${result.team_id}`);
          console.log(`Play Stage: ${result.play_stage}`);
          console.log(`Result: ${result.win_lose}`);
          console.log(`Decided By: ${result.decided_by}`);
          console.log(`Goal Scored: ${result.goal_score}`);
          console.log('-------------------');
        });
  
        displayGuestMenu();
        handleGuestChoice();
      });
    });
  }
   
function browseHighestGoalScorer() {
    console.log('Browse the player with the highest goals scored in all tournaments');
  
    // Fetch the player details with the highest goals scored
    const playerSql = `
      SELECT p.player_id, p.player_name, t.tr_id, MAX(m.goal_score) AS highest_goals
      FROM player p
      INNER JOIN match_played m ON p.player_id = m.player_of_match
      INNER JOIN team t ON p.team_id = t.team_id
      GROUP BY p.player_id, p.player_name, t.tr_id
      ORDER BY highest_goals DESC
      LIMIT 1
    `;
  
    db.query(playerSql, (err, playerResults) => {
      if (err) {
        console.error('Error executing query: ', err);
        return;
      }
  
      if (playerResults.length === 0) {
        console.log('No player found with the highest goals scored in any tournament.');
        return;
      }
  
      const player = playerResults[0];
      const trId = player.tr_id;
  
      // Fetch the tournament name based on the tr_id
      const tournamentSql = `
        SELECT tr_name
        FROM tournament
        WHERE tr_id = ?
      `;
  
      db.query(tournamentSql, [trId], (err, tournamentResult) => {
        if (err) {
          console.error('Error executing query: ', err);
          return;
        }
  
        const tournamentName = tournamentResult[0].tr_name;
  
        // Display the player details with the highest goals scored in all tournaments
        console.log(`Player with the highest goals scored in all tournaments:`);
        console.log(`Player ID: ${player.player_id}`);
        console.log(`Player Name: ${player.player_name}`);
        console.log(`Tournament Name: ${tournamentName}`);
        console.log(`Goals Scored: ${player.highest_goals}`);
        console.log('-------------------');

        displayGuestMenu();
        handleGuestChoice();
      });
    });
  }
      
  function browseRedCardsByTeam() {
    console.log('Browse the players who received red cards in each team');
  
    // Fetch all match details
    const matchDetails = getMatchDetails();
  
    // Fetch all players
    const players = getPlayers();
  
    // Fetch all teams
    const teams = getTeams();
  
    // Filter players who received red cards in each team
    teams.forEach((team) => {
      const redCardPlayers = matchDetails
        .filter((match) => match.team_id === team.team_id && match.red_cards > 0)
        .map((match) => players.find((player) => player.player_id === match.player_gk));
  
      console.log(`Team: ${team.team_id}`);
      console.log('Players Who Received Red Cards:');
      console.log(redCardPlayers);
      console.log('-----------------------------');
    });
  
    displayGuestMenu();
    handleGuestChoice();
  }
  
  // Sample implementation of getMatchDetails, getPlayers, and getTeams functions
  // Replace these with your actual data retrieval functions
  
  function getMatchDetails() {
    // Simulated data retrieval
    return [
      { match_no: 1, team_id: 1214, red_cards: 0, player_gk: 1001 },
      { match_no: 2, team_id: 1215, red_cards: 2, player_gk: 1003 },
      { match_no: 3, team_id: 1216, red_cards: 1, player_gk: 1023 },
      { match_no: 4, team_id: 1217, red_cards: 0, player_gk: 1009 },
    ];
  }
  
  function getPlayers() {
    // Simulated data retrieval
    return [
      { player_id: 1001, player_name: 'Ahmed' },
      { player_id: 1003, player_name: 'Nasr' },
      { player_id: 1023, player_name: 'Yasir' },
      { player_id: 1009, player_name: 'Abdullah' },
    ];
  }
  
  function getTeams() {
    // Simulated data retrieval
    return [
      { team_id: 1214 },
      { team_id: 1215 },
      { team_id: 1216 },
      { team_id: 1217 },
    ];
  }
  
    
  function browseTeamMembers() {
    rl.question('Enter the team ID: ', (teamId) => {
      const sqlQuery = `
        SELECT t.team_id, t.tr_id, p.player_id, p.jersey_no, p.player_name, p.position_to_play
        FROM team AS t
        LEFT JOIN player AS p ON p.team_id = t.team_id
        LEFT JOIN match_captain AS mc ON mc.team_id = t.team_id
        WHERE t.team_id = ${teamId}`;
  
      db.query(sqlQuery, (error, results) => {
        if (error) {
          console.log(`Error fetching team members: ${error}`);
        } else {
          if (results.length === 0) {
            console.log('No team members found for the provided team ID.');
          } else {
            console.log('Team Members:');
            console.log('-------------');
            console.log(`Team ID: ${results[0].team_id}`);
            console.log(`Tournament ID: ${results[0].tr_id}`);
            
            // Retrieve manager, coach, and captain information from the results
            const manager = results.find((row) => row.position_to_play === 'Manager');
            const coach = results.find((row) => row.position_to_play === 'Coach');
            const captain = results.find((row) => row.player_id === row.player_captain);
  
            if (manager) {
                console.log(`Manager: ${manager.playerName}`);
            }
            
            if (coach) {
              console.log(`Coach: ${coach.player_name}`);
            }
            
            if (captain) {
              console.log(`Captain: ${captain.player_name}`);
            }
  
            console.log('Players:');
            results.forEach((row) => {
              console.log(`- Jersey No: ${row.jersey_no}, Name: ${row.player_name}, Position: ${row.position_to_play}`);
            });
          }
        }
  
        displayGuestMenu();
        handleGuestChoice();
      });
    });
  }
  
  
  

// Start the program
displayMenu();
handleChoice();