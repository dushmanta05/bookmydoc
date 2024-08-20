// api/services/memberProjectionService.js
module.exports = {
  filterMemberData: function (data, req) {
    const loggedInUser = req.user;
    const userType = loggedInUser ? loggedInUser.userType : 'non-admin';

    if (userType === 'admin') {
      return data;
    }

    if (Array.isArray(data)) {
      if ('isMemberFlagged' in data[0]) {
        data.forEach(element => {
          delete element.isMemberFlagged;
        });
      } else if ('isMemberFlagged' in data[0].member) {
        data.forEach(element => {
          delete element.member.isMemberFlagged;
        });
      }
      return data;
    } else if (data && typeof data === 'object') {
      if ('isMemberFlagged' in data) {
        delete data.isMemberFlagged;
      } else if ('isMemberFlagged' in data.member) {
        delete data.member.isMemberFlagged;
      }
      return data;
    }
    return data;
  }
};
