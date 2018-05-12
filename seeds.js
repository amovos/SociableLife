// ==========================
// SEED DATABASE
// ==========================

var Activity    = require("./models/activity");
var Comment     = require("./models/comment");
var User        = require("./models/user");


// ==========================
// SEED DATA
// ==========================

var userData = [
    {
        isAdmin: true,
        username: "admin",
        avatar: "https://res.cloudinary.com/amovos/image/upload/v1526124111/sl-dev/avatars/ghost.png",
        firstName: "admin",
        lastName: "admin",
        email: "admin@example.com",
        createdAt: "2018-05-10T10:43:28.991Z",
        salt: "97861dbf390e251fe48a62b67dc7991e0ba3f5ce194ce31837748b08d44ab2e5",
        hash: "bcf086491978642994916c45f804428297ea23ddbd3d55eaee74270fc36e233fe24bf1a1bcd31a7eda941d048c06dd0f6887758cde677a58ca9e2b495a1e5d23330bb90baf9b6de3662b7a77142a20f70f938c8914de1e518d6d36f4aad9433cc1c5ebfac715e7034e0c30345eac0b7cea62ceb96e638e6830699a8335d2b4bde19dc26ffb46d9e76fa16afd310f974b37f7347f9f96dc7456f604c2985437fd2ce876d3dda50d002b6714919bf098361555e94cdb2f40a74023150fef412c09842a855b3555b66313ec0625d3f3cbc02945e090f806be4aa82dabf041ca6240eaa62a54c1525739ea06675cefa5301774a3095d8d777c8ae19cd7d25db944559e0ab6bfaa7388a3caa0a21a02f0f435726d59ab63eeac98993e118594a2e005ab9c78c08b9197803e4636a7315c3d6064d4cc0f000f597605221788d1c11cf888a5b73175202440bc504a1eb3157b40d1e7b783d4d258be4bd09f9dc5afd82c7401cea5331b6455d1b487397660afa816c5071a35ab9348a918b301af2f9c4ff05786fe585a9b310c008e99225041a1dce5ac55a60619f14b7918b2b9608bf5f8422b0b81a8aa117645a3eb0897e2f4ad67eaa9b26e8970b47948da5482170d8aaef73bf83743bc9960f6b6bd09d70235a9bc344227348bd9974f77337c84f6ac5291d77101b3fa64bcf353cf6631ba385ec12f06650cf9b4e8166cb2786f62",
    },
    {
        isAdmin: false,
        username: "tharris",
        avatar: "https://res.cloudinary.com/amovos/image/upload/v1526056591/sl-dev/avatars/1526056588276Headshot.png.png",
        firstName: "Tom",
        lastName: "Harris",
        email: "tharris@amovos.com",
        createdAt: "2017-05-10T10:43:28.991Z",
        salt: "97861dbf390e251fe48a62b67dc7991e0ba3f5ce194ce31837748b08d44ab2e5",
        hash: "bcf086491978642994916c45f804428297ea23ddbd3d55eaee74270fc36e233fe24bf1a1bcd31a7eda941d048c06dd0f6887758cde677a58ca9e2b495a1e5d23330bb90baf9b6de3662b7a77142a20f70f938c8914de1e518d6d36f4aad9433cc1c5ebfac715e7034e0c30345eac0b7cea62ceb96e638e6830699a8335d2b4bde19dc26ffb46d9e76fa16afd310f974b37f7347f9f96dc7456f604c2985437fd2ce876d3dda50d002b6714919bf098361555e94cdb2f40a74023150fef412c09842a855b3555b66313ec0625d3f3cbc02945e090f806be4aa82dabf041ca6240eaa62a54c1525739ea06675cefa5301774a3095d8d777c8ae19cd7d25db944559e0ab6bfaa7388a3caa0a21a02f0f435726d59ab63eeac98993e118594a2e005ab9c78c08b9197803e4636a7315c3d6064d4cc0f000f597605221788d1c11cf888a5b73175202440bc504a1eb3157b40d1e7b783d4d258be4bd09f9dc5afd82c7401cea5331b6455d1b487397660afa816c5071a35ab9348a918b301af2f9c4ff05786fe585a9b310c008e99225041a1dce5ac55a60619f14b7918b2b9608bf5f8422b0b81a8aa117645a3eb0897e2f4ad67eaa9b26e8970b47948da5482170d8aaef73bf83743bc9960f6b6bd09d70235a9bc344227348bd9974f77337c84f6ac5291d77101b3fa64bcf353cf6631ba385ec12f06650cf9b4e8166cb2786f62",
    }
];

var activityData = [
    {
        name: "Parity",
        price: "26",
        location: "Iceland",
        image: "https://res.cloudinary.com/amovos/image/upload/v1526129491/sl-dev/activities/ParityVisit.jpg",
        description: "Ham buffalo pancetta, andouille strip steak turducken meatball sirloin sausage. Pancetta picanha cupim pork chop rump. Rump boudin tail biltong, salami landjaeger andouille cupim swine pork chop short ribs filet mignon doner brisket. Doner bacon buffalo fatback. Turkey ribeye brisket cow fatback kevin meatloaf ham hock.",
        lat: 64.963051,
        lng: -19.020835,
        createdAt: "2018-05-10T10:44:26.159Z",
        imageId: "sl-dev/activities/ParityVisit.jpg",
    },
    {
        name: "Mordor",
        price: "26",
        location: "Iceland",
        image: "https://res.cloudinary.com/amovos/image/upload/v1526122172/sl-dev/activities/1526122172064volcano.jpeg.jpg",
        description: "Ham buffalo pancetta, andouille strip steak turducken meatball sirloin sausage. Pancetta picanha cupim pork chop rump. Rump boudin tail biltong, salami landjaeger andouille cupim swine pork chop short ribs filet mignon doner brisket. Doner bacon buffalo fatback. Turkey ribeye brisket cow fatback kevin meatloaf ham hock.",
        lat: 64.963051,
        lng: -19.020835,
        createdAt: "2018-05-10T10:44:26.159Z",
        imageId: "sl-dev/activities/1526122172064volcano.jpeg",
    }
];


// ==========================
// SEED FUNCTION
// ==========================

async function seedDB(){
   
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
    } catch(err) {
        console.log(err);
        return;
    }
    
    console.log("Created User " + adminUser.username);
    console.log("Created User " + tharrisUser.username);

    // ==========================
    // SET ACTIVITY AUTHORS
    // ==========================
    
    // Set first activity author
    var authorAdmin = {
        id: adminUser.id,
        username: adminUser.username
    };
    activityData[0].author = authorAdmin;
    
    //set second activity author
    var authortharris = {
        id: tharrisUser.id,
        username: tharrisUser.username
    };
    activityData[1].author = authortharris;

    // ==========================
    // CREATE ACTIVITIES
    // ==========================
    try {
        var activityOne = await Activity.create(activityData[0]);
        var activityTwo = await Activity.create(activityData[1]);
    } catch(err) {
        console.log(err);
        return;
    }
    
    console.log("Created Activity " + activityOne.name);
    console.log("Created Activity " + activityTwo.name);

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
                            activityOne.comments.push(comment);
                            activityOne.save();
                        }
                    });
    
    Comment.create({
                    text: "This place is great, but I wish there was internet",
                    author: authorAdmin
                }, function(err, comment){
                    if(err){
                        console.log(err);
                        return;
                    } else {
                        activityTwo.comments.push(comment);
                        activityTwo.save();
                    }
                });
}

module.exports = seedDB; //sends the function that can then be executed in the app.js file