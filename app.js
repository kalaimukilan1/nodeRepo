const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Started Successfully at http://localhost:3000");
    });
  } catch (e) {
    console.log(`Db Error ${e.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

module.exports = app;

// GET player Details

app.get("/players/", async (request, response) => {
  const getPlayerDetails = `
    SELECT * 
    FROM cricket_team;`;
  const getPlayer = await db.all(getPlayerDetails);
  response.send(getPlayer);
});

// ADD Player Details

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const addPlayerQuery = `
    INSERT INTO cricket_team(player_name,jersey_number,role)
    VALUES(
        "${playerName}",
         ${jerseyNumber},
         "${role}");`;

  const addPlayer = await db.run(addPlayerQuery);

  const playerId = addPlayer.lastID;
  response.send("Player Added to Team");
});

//GET Player Based On Player ID
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerDetails = `
    SELECT * 
    FROM cricket_team 
    WHERE player_id = ${playerId};`;

  const playerDetails = await db.get(getPlayerDetails);
  response.send(playerDetails);
});

//UPDATE Player Details
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const updateDetails = request.body;
  const { playerName, jerseyNumber, role } = updateDetails;

  const updatePlayerQuery = `
    UPDATE  cricket_team 
    SET 
      player_name = "${playerName}",
      jersey_number = ${jerseyNumber},
      role = "${role}"
    WHERE player_id = ${playerId};`;

  await db.run(updatePlayerQuery);
  response.send("Player Details Updated");
});

// DELETE Player Detail
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const DeletePlayerQuery = `
    DELETE FROM cricket_team 
    WHERE player_id = ${playerId};`;

  await db.run(DeletePlayerQuery);
  response.send("Player Removed");
});
