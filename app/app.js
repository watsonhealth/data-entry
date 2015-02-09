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
    'click #submit_call': function (e, templ) {
      e.preventDefault();
      var symptAndValues = [];
      var currentContexts = Session.get('contexts');

      //Ugly Jquery to get it all
      _.each(templ.$(".newsymptom"),function(tr_symptom){
        symptAndValues.push({
          'symptom_id': $(tr_symptom).attr('id'),
          'important': $(tr_symptom).find('input').is(':checked')
        });
      });
      console.log(symptAndValues);

      var sickness = {
        'name' : templ.$('#sick_name').val(),
        'incidence' : templ.$('#sick_incidence').val(),
        'symptoms' : symptAndValues,
        'contexts' : currentContexts
      };
      Sicknesses.insert(sickness, function(error, id){
        if (!error){
          alert("Sickness inserted successfully with id" + id);
        } else{
          alert("something went wrong...retry !");
        }
      });


    }
  });

  Template.sicknessEntryForm.helpers({
    'symptoms' : function(){
      var currentSymptoms = Session.get("symptoms");
      return Symptoms.find({'_id':{$in:currentSymptoms}});
    },
    'contexts' : function(){
      var currentContexts = Session.get("contexts");
      return Contexts.find({'_id':{$in:currentContexts}});
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
      var currentSymptoms = Session.get('symptoms');
      currentSymptoms.pop(templ.data._id);
      Session.set('symptoms', currentSymptoms);
    }
  });  

  Template.context.events({
    'click .remove_context' : function (e, templ){
      var currentContexts = Session.get('contexts');
      currentContexts.pop(templ.data._id);
      Session.set('contexts', currentContexts);
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

  Template.symptomSelector.events({
    'click #create_context_submit' : function(e, templ){
      var res = {
        'name' : templ.$("#create_name").val(),
      };

      //Clear the object
      templ.$("#create_name").val('');
      templ.$("#create_position").val('');
      templ.$("#create_photo_url").val('');

      var currentSymptoms = Session.get("symptoms");
      //Insert the result and add its id to the session
      currentSymptoms.push(Symptoms.insert(res));
      Session.set('symptoms', currentSymptoms);
    }
  });  

  Template.contextSelector.events({
    'click #create_context_submit' : function(e, templ){
      var res = {
        'name' : templ.$("#create_context_name").val()
      };

      //Clear the object
      templ.$("#create_context_name").val('');

      var currentContexts = Session.get("contexts");
      //Insert the result and add its id to the session
      currentContexts.push(Contexts.insert(res));
      Session.set('contexts', currentContexts);
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
