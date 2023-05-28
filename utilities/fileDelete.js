const fs = require('fs').promises;
const path = require('path');

async function deleteFile(filePath,direct=false) {
    const absolutePath = direct ? filePath : path.resolve(__dirname, '..', 'user_profile_pic', filePath);
    try {
        await fs.unlink(absolutePath);
    }catch(err){
        console.log(err);
    }
}

module.exports = deleteFile;