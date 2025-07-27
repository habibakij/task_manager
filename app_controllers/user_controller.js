
const connectDB = require("../app_config/db_connection");

var getProfileData= async (req, res)=> {
    try {
        const dbConnection = await connectDB();
        const [userProfileData] = await dbConnection.execute("SELECT * FROM USER_PROFILE");
        if (userProfileData.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: "Profile information", user: userProfileData});
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ error: "Internal server error: " + error.message });
    }
}

module.exports = getProfileData;
