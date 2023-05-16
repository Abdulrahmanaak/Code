CREATE TABLE tournament (
 tr_id numeric NOT NULL,
 tr_name character varying(40) NOT NULL,
 start_date date NOT NULL,
 end_date date NOT NULL,
PRIMARY KEY (tr_id) );
INSERT INTO tournament VALUES (1, 'Faculty Tournament', '2023-03-10', '2023-03-25');
INSERT INTO tournament VALUES (2, 'Open Tournament', '2023-03-15', '2023-03-30');
INSERT INTO tournament VALUES (3, 'Student Tournament', '2022-12-10', '2022-12-02');
INSERT INTO tournament VALUES (4, 'Staff Tournament', '2023-02-15', '2023-02-25');
INSERT INTO tournament VALUES (5, 'Annual Tournament', '2023-01-01', '2023-01-15');
CREATE TABLE venue (
 venue_id numeric NOT NULL,
 venue_name character varying(30) NOT NULL,
 venue_status character(1) NOT NULL,
 aud_capacity numeric NOT NULL,
PRIMARY KEY (venue_id) );
INSERT INTO venue VALUES (11, 'Main Stadium', 'Y', 20000);
INSERT INTO venue VALUES (22, 'Indoor Stadium', 'Y', 1000);
INSERT INTO venue VALUES (33, 'Jabal Field', 'N', 500);
INSERT INTO venue VALUES (44, 'Student Field', 'Y', 2000);
CREATE TABLE team (
 team_id numeric NOT NULL,
 tr_id numeric NOT NULL,
 team_group character(1) NOT NULL,
 match_played numeric NOT NULL,
 won numeric NOT NULL,
 draw numeric NOT NULL,
 lost numeric NOT NULL,
 goal_for numeric NOT NULL,
 goal_against numeric NOT NULL,
 goal_diff numeric NOT NULL,
 points numeric NOT NULL,
 group_position numeric NOT NULL,
PRIMARY KEY (team_id, tr_id),
FOREIGN KEY (tr_id) REFERENCES tournament (tr_id));
INSERT INTO team VALUES (1214,1,'A',3,0,3,0,4,4,0,3,1);
INSERT INTO team VALUES (1215,1,'B',3,1,1,1,3,4,-1,4,2);
INSERT INTO team VALUES (1216,2,'C',3,1,1,1,0,0,0,4,2);
INSERT INTO team VALUES (1217,2,'A',3,1,1,1,1,4,-3,4,1);
INSERT INTO team VALUES (1216,3,'A',3,1,1,1,2,4,-2,4,3);
INSERT INTO team VALUES (1217,3,'B',3,1,1,1,4,2,2,4,1);
INSERT INTO team VALUES (1218,3,'C',3,1,1,1,1,2,-1,4,2);
CREATE TABLE playing_position (
 position_id character(2) NOT NULL,
 position_desc character varying(15) NOT NULL,
PRIMARY KEY (position_id) );
INSERT INTO playing_position VALUES ('GK', 'Goalkeepers');
INSERT INTO playing_position VALUES ('DF', 'Defenders');
INSERT INTO playing_position VALUES ('MF', 'Midfielders');
INSERT INTO playing_position VALUES ('FD', 'Forwards');
CREATE TABLE player (
 player_id numeric NOT NULL,
 team_id numeric NOT NULL,
 jersey_no numeric NOT NULL,
 player_name character varying(40) NOT NULL,
 position_to_play character(2) NOT NULL,
 dt_of_bir date,
 red_card numeric DEFAULT 0,
 yellow_card numeric DEFAULT 0,
PRIMARY KEY (player_id, team_id),
FOREIGN KEY (team_id) REFERENCES team (team_id));
INSERT INTO player VALUES (1001,1214,1, 'Ahmed', 'GK', '1999-03-10', 1, 0);
INSERT INTO player VALUES (1008,1214,2, 'Khalid', 'DF', '1977-02-12', 2, 3);
INSERT INTO player VALUES (1016,1214,3, 'Saeed', 'MF', '1999-08-05', 0, 1);
INSERT INTO player VALUES (1007,1215,1, 'Majid', 'DF', '1998-02-20', 0, 0);
INSERT INTO player VALUES (1013,1215,5, 'Fahd', 'MF', '1997-07-27', 0, 0);
INSERT INTO player VALUES (1010,1215,6, 'Mohammed', 'DF', '1992-11-20', 0, 0);
INSERT INTO player VALUES (1004,1215,7, 'Ali', 'DF', '1995-10-11', 0, 0);
INSERT INTO player VALUES (1012,1215,8, 'Raed', 'MF', '1997-01-05', 0, 0);
INSERT INTO player VALUES (1017,1215,9, 'Mousa', 'MF', '1996-12-17', 0, 0);
INSERT INTO player VALUES (1023,1216,1, 'Naeem', 'GK', '1991-05-27', 0, 0);
INSERT INTO player VALUES (1022,1216,4, 'Yasir', 'FD', '1998-07-15', 0, 0);
INSERT INTO player VALUES (1003,1217,2, 'Nasr', 'GK', '1997-09-25', 0, 0);
INSERT INTO player VALUES (1015,1217,13, 'Ashraf', 'MF', '1994-01-16', 0, 0);
INSERT INTO player VALUES (1019,1217,14, 'Hassan', 'MF', '1991-03-28', 0, 0);
INSERT INTO player VALUES (1009,1217,15, 'Abdullah', 'DF', '1996-06-09', 0, 0);
INSERT INTO player VALUES (1021,1217,16, 'Bassam', 'FD', '1999-07-27', 0, 0);
CREATE TABLE referee (
 referee_id numeric NOT NULL,
 referee_name character varying(40) NOT NULL,
PRIMARY KEY (referee_id) );
INSERT INTO referee VALUES (7001,'Hassan');
INSERT INTO referee VALUES (7002,'Robert');
INSERT INTO referee VALUES (7003,'Fayez');
INSERT INTO referee VALUES (7004, 'Mark');
INSERT INTO referee VALUES (7005,'Ahmad');
INSERT INTO referee VALUES (7006,'Faisal');
INSERT INTO referee VALUES (7007,'Noman');
CREATE TABLE match_played (
 match_no numeric NOT NULL,
 play_stage character(1) NOT NULL,
 play_date date NOT NULL,
 results character(5) NOT NULL,
 decided_by character(1) NOT NULL,
 goal_score character(5) NOT NULL,
 venue_id numeric NOT NULL,
 referee_id numeric NOT NULL,
 audience numeric NOT NULL,
 player_of_match numeric NOT NULL,
 stop1_sec numeric NOT NULL,
 stop2_sec numeric NOT NULL,
PRIMARY KEY (match_no),
FOREIGN KEY (venue_id) REFERENCES venue (venue_id),
FOREIGN KEY (referee_id) REFERENCES referee (referee_id),
FOREIGN KEY (player_of_match) REFERENCES player(player_id));
INSERT INTO match_played VALUES (1, 'G', '2020-03-11', 'WIN', 'N', '2-1',11,7001,5113,1015,131,242);
INSERT INTO match_played VALUES (2, 'G', '2020-03-11', 'DRAW', 'N', '1-1',22,7002,510,1003,111,272);
INSERT INTO match_played VALUES (3, 'G', '2020-03-11', 'DRAW', 'N', '1-1',33,7002,510,1003,111,272);
INSERT INTO match_played VALUES (4, 'G', '2020-03-11', 'DRAW', 'N', '1-1',11,7002,510,1003,111,272);
INSERT INTO match_played VALUES (5, 'G', '2020-03-11', 'DRAW', 'N', '1-1',44,7002,510,1003,111,272);
INSERT INTO match_played VALUES (6, 'G', '2020-03-11', 'DRAW', 'N', '1-1',22,7002,510,1003,111,272);
INSERT INTO match_played VALUES (7, 'G', '2020-03-11', 'DRAW', 'N', '1-1',33,7002,510,1003,111,272);
CREATE TABLE coach (
 coach_id numeric NOT NULL,
 coach_name character varying(40) NOT NULL,
PRIMARY KEY (coach_id) );
INSERT INTO coach VALUES (9001,'Carlos');
INSERT INTO coach VALUES (9003,'Farhan');
INSERT INTO coach VALUES (9002,'Jameel');
CREATE TABLE asst_referee (
 asst_ref_id numeric NOT NULL,
 asst_ref_name character varying(40) NOT NULL,
PRIMARY KEY (asst_ref_id) );
INSERT INTO asst_referee VALUES (3001,'Ahmed');
INSERT INTO asst_referee VALUES (3003,'Saied');
INSERT INTO asst_referee VALUES (3002,'Fadhel');
INSERT INTO asst_referee VALUES (3004,'Morad');
INSERT INTO asst_referee VALUES (3005,'Farid');
CREATE TABLE match_details (
 match_no numeric NOT NULL,
 team_id numeric NOT NULL,
 play_stage character(1) NOT NULL,
 win_lose character(1) NOT NULL,
 decided_by character(1) NOT NULL,
 goal_score numeric NOT NULL,
 penalty_score numeric,
 asst_ref numeric NOT NULL,
 player_gk numeric NOT NULL,
PRIMARY KEY (match_no, team_id),
FOREIGN KEY (team_id) REFERENCES team (team_id),
FOREIGN KEY (asst_ref) REFERENCES asst_referee (asst_ref_id),
FOREIGN KEY (player_gk) REFERENCES player (player_id),
FOREIGN KEY (match_no) REFERENCES match_played (match_no));
INSERT INTO match_details VALUES (1, 1214, 'G', 'W', 'N', 1, 0,3001,1001);
INSERT INTO match_details VALUES (2, 1215, 'G', 'W', 'N', 2, 0,3004,1003);
INSERT INTO match_details VALUES (2, 1217, 'G', 'L', 'N', 2, 0,3003,1023);
INSERT INTO match_details VALUES (1, 1216, 'G', 'L', 'N', 1, 0,3001,1001);
INSERT INTO match_details VALUES (3, 1215, 'G', 'W', 'N', 2, 0,3002,1003);
INSERT INTO match_details VALUES (3, 1218, 'G', 'W', 'N', 2, 0,3005,1023);
CREATE TABLE goal_details (
 goal_id numeric NOT NULL,
 match_no numeric NOT NULL,
 player_id numeric NOT NULL,
 team_id numeric NOT NULL,
 goal_time numeric NOT NULL,
 goal_type character(1) NOT NULL,
 play_stage character(1) NOT NULL,
 goal_schedule character(2) NOT NULL,
 goal_half numeric,
PRIMARY KEY (goal_id),
FOREIGN KEY (team_id) REFERENCES team (team_id),
FOREIGN KEY (player_id) REFERENCES player (player_id),
FOREIGN KEY (match_no) REFERENCES match_played (match_no));
INSERT INTO goal_details VALUES (1, 1, 1008, 1214, 72, 'N', 'G', 'NT',2);
INSERT INTO goal_details VALUES (2, 1, 1013, 1214, 82, 'N', 'G', 'NT',2);
INSERT INTO goal_details VALUES (3, 1, 1007, 1214, 72, 'N', 'G', 'NT',2);
INSERT INTO goal_details VALUES (4, 1, 1004, 1214, 12, 'N', 'G', 'NT',1);
INSERT INTO goal_details VALUES (5, 1, 1017, 1214, 15, 'N', 'G', 'NT',1);
INSERT INTO goal_details VALUES (6, 1, 1019, 1214, 32, 'N', 'G', 'NT',1);
CREATE TABLE penalty_shootout (
 kick_id numeric NOT NULL,
 match_no numeric NOT NULL,
 team_id numeric NOT NULL,
 player_id numeric NOT NULL,
 score_goal character(1) NOT NULL,
 kick_no numeric NOT NULL,
PRIMARY KEY (kick_id),
FOREIGN KEY (team_id) REFERENCES team (team_id),
FOREIGN KEY (player_id) REFERENCES player (player_id),
FOREIGN KEY (match_no) REFERENCES match_played (match_no));
INSERT INTO penalty_shootout VALUES (1, 1, 1215, 1019, 'N', 1);
INSERT INTO penalty_shootout VALUES (2, 5, 1217, 1009, 'Y', 4);
CREATE TABLE player_booked (
 match_no numeric NOT NULL,
 team_id numeric NOT NULL,
 player_id numeric NOT NULL,
 booking_time numeric NOT NULL,
 sent_off character(1),
 play_schedule character(2) NOT NULL,
 play_half numeric NOT NULL,
PRIMARY KEY (match_no, team_id, player_id),
FOREIGN KEY (team_id) REFERENCES team (team_id),
FOREIGN KEY (player_id) REFERENCES player (player_id),
FOREIGN KEY (match_no) REFERENCES match_played (match_no));
INSERT INTO player_booked VALUES (1, 1215, 1019, 36, 'N','NT', 1);
INSERT INTO player_booked VALUES (1, 1217, 1023, 76, 'Y','NT', 2);
CREATE TABLE player_in_out (
 match_no numeric NOT NULL,
 team_id numeric NOT NULL,
 player_id numeric NOT NULL,
 in_out character(1) NOT NULL,
 time_in_out numeric NOT NULL,
 play_schedule character(2) NOT NULL,
 play_half numeric NOT NULL,
PRIMARY KEY (match_no, team_id),
FOREIGN KEY (team_id) REFERENCES team (team_id),
FOREIGN KEY (player_id) REFERENCES player (player_id),
FOREIGN KEY (match_no) REFERENCES match_played (match_no));
INSERT INTO player_in_out VALUES (1, 1214, 1019, 'I',73,'NT', 2);
INSERT INTO player_in_out VALUES (2, 1215, 1023, 'O',33,'NT', 1);
CREATE TABLE match_captain (
 match_no numeric NOT NULL,
 team_id numeric NOT NULL,
 player_captain numeric NOT NULL,
PRIMARY KEY (match_no, team_id),
FOREIGN KEY (team_id) REFERENCES team (team_id),
FOREIGN KEY (player_captain) REFERENCES player (player_id),
FOREIGN KEY (match_no) REFERENCES match_played (match_no));
INSERT INTO match_captain VALUES (1, 1214, 1019);
INSERT INTO match_captain VALUES (2, 1215, 1023);
CREATE TABLE team_coaches (
 team_id numeric NOT NULL,
 tr_id numeric NOT NULL,
 coach_id numeric NOT NULL,
PRIMARY KEY (team_id, tr_id),
FOREIGN KEY (team_id) REFERENCES team (team_id),
FOREIGN KEY (tr_id) REFERENCES tournament(tr_id),
FOREIGN KEY (coach_id) REFERENCES coach (coach_id));
INSERT INTO team_coaches VALUES (1214, 2, 9001);
INSERT INTO team_coaches VALUES (1215, 3, 9003);
CREATE TABLE penalty_gk (
 match_no numeric NOT NULL,
 team_id numeric NOT NULL,
 player_gk numeric NOT NULL,
PRIMARY KEY (match_no, team_id),
FOREIGN KEY (team_id) REFERENCES team (team_id),
FOREIGN KEY (player_gk) REFERENCES player (player_id),
FOREIGN KEY (match_no) REFERENCES match_played (match_no));
INSERT INTO penalty_gk VALUES (1, 1214, 1023);
INSERT INTO penalty_gk VALUES (1, 1215, 1007);

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);

INSERT INTO users (username, password)
VALUES

  ('john', 'password123'),
  ('jane', 'password456'),
  ('admin', 'adminpass');

  CREATE TABLE team_manager (
  manager_id numeric NOT NULL,
  manager_name character varying(40) NOT NULL,
  team_id numeric NOT NULL,
  tr_id numeric NOT NULL,
  PRIMARY KEY (manager_id),
  FOREIGN KEY (team_id, tr_id) REFERENCES team (team_id, tr_id)
);

INSERT INTO team_manager (manager_id, manager_name, team_id, tr_id) VALUES (1, 'John Doe', 1214, 1);
INSERT INTO team_manager (manager_id, manager_name, team_id, tr_id) VALUES (2, 'Jane Smith', 1215, 1);
INSERT INTO team_manager (manager_id, manager_name, team_id, tr_id) VALUES (3, 'Michael Johnson', 1216, 2);
