//We define the database everywhere
Sicknesses = new Mongo.Collection("sicknesses");

Symptoms = new Mongo.Collection("symptoms");

Contexts = new Mongo.Collection("contexts");

if (Meteor.isClient) {
  Meteor.startup(function (){
    console.log("Starting");

    //To Debug and start with a good first symptom
    Tracker.autorun(function () {
      if(Symptoms.findOne()){
        Session.set("symptoms", [Symptoms.findOne()._id]);
      console.log("first symptom found");
      }

    //To start with contexts
    Session.set('contexts',[]);
    });

  });

  Template.sicknessEntryForm.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set("counter", Session.get("counter") + 1);
    }
  });

  Template.sicknessEntryForm.helpers({
    'symptoms' : function(){
      var res = [];
      var currentSymptoms = Session.get("symptoms");
      _.each(currentSymptoms, function (symptomId){
        res.push(Symptoms.findOne(symptomId));
      });
      console.log(res);
      return res;
    },
    'contexts' : function(){
      var res = [];
      var currentContexts = Session.get("contexts");
      _.each(currentContexts, function(contextId){
        res.push(Contexts.findOne(contextId));
      });
      return res;
    }
  });  

  Template.symptom_display.events({
    'click .add_symptom' : function (e, templ){
      var currentSymptoms = Session.get('symptoms');
      currentSymptoms.push(templ.data._id);
      Session.set('symptoms', currentSymptoms);
    }
  });    

  Template.context_display.events({
    'click .add_context' : function (e, templ){
      var currentContexts = Session.get('contexts');
      currentContexts.push(templ.data._id);
      Session.set('contexts', currentContexts);
    }
  });  

  Template.symptom.events({
    'click .remove_symptom' : function (e, templ){
      console.log(templ.data);
    }
  });  

  Template.context.events({
    'click .remove_context' : function (e, templ){
      console.log(templ.data);
    }
  });

  Template.symptomSelector.helpers({
    'all_symptoms' : function(){
      var res = [];
      var currentSymptoms = Session.get("symptoms");
      res = Symptoms.find({_id :{$nin:currentSymptoms}}, {sort: {name :1}});
      return res;
    }
  });

  Template.contextSelector.helpers({
    'all_contexts' : function(){
      var res = [];
      var currentContexts = Session.get("contexts");
      res = Contexts.find({_id :{$nin:currentContexts}}, {sort: {name :1}});
      return res;
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Symptoms.find({}).count() === 0){
      var fievre = {
        'name' : 'Fièvre',
        'place' : '1',
        'photo_url' : 'fievre.jpg'
      };

      var malaise = {
        'name' : 'Malaise général',
        'place' : '0',
        'photo_url' : 'malaise_general.jpg'
      };

      var frissons = {
        'name' : 'Frissons',
        'place' : '1',
        'photo_url' : 'frissons.jpg'
      };

      Symptoms.insert(fievre);
      Symptoms.insert(frissons);
      Symptoms.insert(malaise);

    }
    if (Contexts.find({}).count() === 0){
      var context1 = {
        'name' : "Cas dans l'entourage"
      };

      Contexts.insert(context1);
    }
  });
}
