// ==========================
// SEED DATABASE
// ==========================

var Activity    = require("./models/activity");
var Comment     = require("./models/comment");
var User        = require("./models/user");

var geocoder = require("./routes/shared/geocoder");

// ==========================
// SEED DATA
// ==========================

var userData = [
    {
        isAdmin: true,
        username: "admin@example.com",
        displayName: "admin",
        avatar: "https://res.cloudinary.com/amovos/image/upload/v1526124111/sl-dev/avatars/ghost.png",
        avatarId: "sl-dev/avatars/ghost.png",
        firstName: "admin",
        lastName: "admin",
        email: "admin@example.com",
        createdAt: "2018-05-10T10:43:28.991Z",
        salt: "97861dbf390e251fe48a62b67dc7991e0ba3f5ce194ce31837748b08d44ab2e5",
        hash: "bcf086491978642994916c45f804428297ea23ddbd3d55eaee74270fc36e233fe24bf1a1bcd31a7eda941d048c06dd0f6887758cde677a58ca9e2b495a1e5d23330bb90baf9b6de3662b7a77142a20f70f938c8914de1e518d6d36f4aad9433cc1c5ebfac715e7034e0c30345eac0b7cea62ceb96e638e6830699a8335d2b4bde19dc26ffb46d9e76fa16afd310f974b37f7347f9f96dc7456f604c2985437fd2ce876d3dda50d002b6714919bf098361555e94cdb2f40a74023150fef412c09842a855b3555b66313ec0625d3f3cbc02945e090f806be4aa82dabf041ca6240eaa62a54c1525739ea06675cefa5301774a3095d8d777c8ae19cd7d25db944559e0ab6bfaa7388a3caa0a21a02f0f435726d59ab63eeac98993e118594a2e005ab9c78c08b9197803e4636a7315c3d6064d4cc0f000f597605221788d1c11cf888a5b73175202440bc504a1eb3157b40d1e7b783d4d258be4bd09f9dc5afd82c7401cea5331b6455d1b487397660afa816c5071a35ab9348a918b301af2f9c4ff05786fe585a9b310c008e99225041a1dce5ac55a60619f14b7918b2b9608bf5f8422b0b81a8aa117645a3eb0897e2f4ad67eaa9b26e8970b47948da5482170d8aaef73bf83743bc9960f6b6bd09d70235a9bc344227348bd9974f77337c84f6ac5291d77101b3fa64bcf353cf6631ba385ec12f06650cf9b4e8166cb2786f62",
    },
    {
        isAdmin: false,
        username: "info@amovos.com",
        displayName: "tharris",
        avatar: "https://res.cloudinary.com/amovos/image/upload/v1526056591/sl-dev/avatars/1526056588276Headshot.png.png",
        avatarId: "sl-dev/avatars/1526056588276Headshot.png.png",
        firstName: "Tom",
        lastName: "Harris",
        email: "info@amovos.com",
        createdAt: "2017-05-10T10:43:28.991Z",
        salt: "97861dbf390e251fe48a62b67dc7991e0ba3f5ce194ce31837748b08d44ab2e5",
        hash: "bcf086491978642994916c45f804428297ea23ddbd3d55eaee74270fc36e233fe24bf1a1bcd31a7eda941d048c06dd0f6887758cde677a58ca9e2b495a1e5d23330bb90baf9b6de3662b7a77142a20f70f938c8914de1e518d6d36f4aad9433cc1c5ebfac715e7034e0c30345eac0b7cea62ceb96e638e6830699a8335d2b4bde19dc26ffb46d9e76fa16afd310f974b37f7347f9f96dc7456f604c2985437fd2ce876d3dda50d002b6714919bf098361555e94cdb2f40a74023150fef412c09842a855b3555b66313ec0625d3f3cbc02945e090f806be4aa82dabf041ca6240eaa62a54c1525739ea06675cefa5301774a3095d8d777c8ae19cd7d25db944559e0ab6bfaa7388a3caa0a21a02f0f435726d59ab63eeac98993e118594a2e005ab9c78c08b9197803e4636a7315c3d6064d4cc0f000f597605221788d1c11cf888a5b73175202440bc504a1eb3157b40d1e7b783d4d258be4bd09f9dc5afd82c7401cea5331b6455d1b487397660afa816c5071a35ab9348a918b301af2f9c4ff05786fe585a9b310c008e99225041a1dce5ac55a60619f14b7918b2b9608bf5f8422b0b81a8aa117645a3eb0897e2f4ad67eaa9b26e8970b47948da5482170d8aaef73bf83743bc9960f6b6bd09d70235a9bc344227348bd9974f77337c84f6ac5291d77101b3fa64bcf353cf6631ba385ec12f06650cf9b4e8166cb2786f62",
    },
    {
        isAdmin: false,
        username: "user1@example.com",
        displayName: "user1",
        avatar: "https://res.cloudinary.com/amovos/image/upload/v1526054504/avatarPlaceHolder.jpg",
        avatarId: "avatarPlaceHolder.jpg",
        firstName: "user1",
        lastName: "user1",
        email: "user1@example.com",
        createdAt: "2018-05-10T10:43:28.991Z",
        salt: "97861dbf390e251fe48a62b67dc7991e0ba3f5ce194ce31837748b08d44ab2e5",
        hash: "bcf086491978642994916c45f804428297ea23ddbd3d55eaee74270fc36e233fe24bf1a1bcd31a7eda941d048c06dd0f6887758cde677a58ca9e2b495a1e5d23330bb90baf9b6de3662b7a77142a20f70f938c8914de1e518d6d36f4aad9433cc1c5ebfac715e7034e0c30345eac0b7cea62ceb96e638e6830699a8335d2b4bde19dc26ffb46d9e76fa16afd310f974b37f7347f9f96dc7456f604c2985437fd2ce876d3dda50d002b6714919bf098361555e94cdb2f40a74023150fef412c09842a855b3555b66313ec0625d3f3cbc02945e090f806be4aa82dabf041ca6240eaa62a54c1525739ea06675cefa5301774a3095d8d777c8ae19cd7d25db944559e0ab6bfaa7388a3caa0a21a02f0f435726d59ab63eeac98993e118594a2e005ab9c78c08b9197803e4636a7315c3d6064d4cc0f000f597605221788d1c11cf888a5b73175202440bc504a1eb3157b40d1e7b783d4d258be4bd09f9dc5afd82c7401cea5331b6455d1b487397660afa816c5071a35ab9348a918b301af2f9c4ff05786fe585a9b310c008e99225041a1dce5ac55a60619f14b7918b2b9608bf5f8422b0b81a8aa117645a3eb0897e2f4ad67eaa9b26e8970b47948da5482170d8aaef73bf83743bc9960f6b6bd09d70235a9bc344227348bd9974f77337c84f6ac5291d77101b3fa64bcf353cf6631ba385ec12f06650cf9b4e8166cb2786f62",
    }
];

var activityData = require("./seedActivityDataFile.js");

// ==========================
// SEED FUNCTION
// ==========================

async function seedDB(req){
   
// ==========================
// DELETE ALL DATA
// ==========================
// Don't delete images from Cloudinary as the links need to stay the same

    try {
        await Activity.remove({});
        await Comment.remove({});
        await User.remove({});
    } catch(err) {
        console.log(err);
        return;
    }
    console.log("Deleted all existing data");

// ==========================
// CREATE NEW DATA
// ==========================

// First create user
// Then create campgrounds with that user
// Then create comments for those campground with those users

    // ==========================
    // CREATE USERS
    // ==========================
    try {
        var adminUser = await User.create(userData[0]);
        var tharrisUser = await User.create(userData[1]);
        var user1 = await User.create(userData[2]);
    } catch(err) {
        console.log(err);
        return;
    }
    
    console.log("Created User " + adminUser.username);
    console.log("Created User " + tharrisUser.username);
    console.log("Created User " + user1.username);

    // ==========================
    // SET ACTIVITY AUTHORS
    // ==========================
    
    // Set first activity author
    var authorAdmin = {
        id: adminUser.id,
        displayName: adminUser.displayName
    };
    activityData[0].author = authorAdmin;
    
    //set second activity author
    var authortharris = {
        id: tharrisUser.id,
        displayName: tharrisUser.displayName
    };
    activityData[1].author = authortharris;
    
    //set general activity author
    var authorUser1 = {
        id: user1.id,
        displayName: user1.displayName
    };

    // ==========================
    // CREATE ACTIVITIES
    // ==========================
    try {
        // create all activities
        for(var i=0; i<activityData.length; i++){
            activityData[i].author = authorAdmin;
            
            //This was only needed the first time the data was imported
            // // GEOCODE Location
            // //generate geocode data, use "await" to make sure it completes before creating activity
            // await geocoder.geocode(activityData[i].location, function (err, data) {
            //     activityData[i].lat = data[0].latitude;
            //     activityData[i].lng = data[0].longitude;
            //     activityData[i].location = data[0].formattedAddress; 
            // });
            
            var newActivity = await Activity.create(activityData[i]);


            // ==========================
            // ADD COMMENTS TO ACTIVITIES
            // ==========================
    
            Comment.create({
                                text: "This place is great, brilliant facilities",
                                author: authortharris
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                    return;
                                } else {
                                    newActivity.comments.push(comment);
                                    newActivity.save();
                                }
                            });
            
            Comment.create({
                            text: "I love going here and meeting new people :)",
                            author: authorUser1
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                                return;
                            } else {
                                newActivity.comments.push(comment);
                                newActivity.save();
                            }
                        });
                
        }
    } catch(err) {
        console.log(err);
        return;
    }
}

module.exports = seedDB; //sends the function that can then be executed in the app.js file