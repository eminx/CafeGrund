Meteor.methods({
  createPage(formValues) {
    const user = Meteor.user();
    if (!user || !user.isSuperAdmin) {
      throw new Meteor.Error('Not allowed!');
    }

    check(formValues.title, String);
    check(formValues.longDescription, String);

    try {
      const newPageId = Pages.insert({
        authorId: user._id,
        authorName: user.username,
        title: formValues.title,
        // imageUrl,
        longDescription: formValues.longDescription,
        isPublished: true,
        creationDate: new Date()
      });
      return formValues.title;
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't add to Collection");
    }
  },

  updatePage(pageId, formValues) {
    const user = Meteor.user();
    if (!user || !user.isSuperAdmin) {
      throw new Meteor.Error('Not allowed!');
    }

    check(formValues.title, String);
    check(formValues.longDescription, String);
    // check(imageUrl, String);

    try {
      Pages.update(pageId, {
        $set: {
          title: formValues.title,
          longDescription: formValues.longDescription,
          // imageUrl,
          latestUpdate: new Date()
        }
      });
      return formValues.title;
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't add to Collection");
    }
  },

  deletePage(pageId) {
    const user = Meteor.user();
    if (!user || !user.isSuperAdmin) {
      throw new Meteor.Error('You are not allowed!');
    }

    try {
      Pages.remove(pageId);
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't remove from collection");
    }
  }
});
