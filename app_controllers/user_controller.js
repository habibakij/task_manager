const connectDB = require("../app_config/db_connection");

var getProfileData = async (req, res) => {
  try {
    const dbConnection = await connectDB();
    const [userProfileData] = await dbConnection.execute(
      "SELECT * FROM USER_PROFILE"
    );
    if (userProfileData.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res
      .status(200)
      .json({ message: "Profile information", user: userProfileData });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Internal server error: " + error.message });
  }
};

var updateUserProfile = async (req, res) => {
  var { id, first_name, last_name, phone, email, profession } = req.body;

  if (!id || !first_name || !last_name || !phone || !email || !profession) {
    return res
      .status(400)
      .json({ message: "Required all field, Please fill up" });
  }

  try {
    const dbConnection = await connectDB();
    const [result] = await dbConnection.execute(
      "UPDATE USER_PROFILE SET first_name = ?, last_name = ?, phone = ?, email = ?, profession = ? WHERE id = ?",
      [first_name, last_name, phone, email, profession, id]
    );
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "No user found" });
    }
    return res.status(400).json({ message: "Update successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error: " + error.message });
  }
};

module.exports = { getProfileData, updateUserProfile };
