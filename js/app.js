app = {
	models: {},
	views: {},
	collections: {},
	routers: {},
	
	init: function() {
		var jobInit = new app.views.SearchJobList(dataJobs)
	}
};

app.models.Job = Backbone.Model.extend({
	
});

app.models.JobDescription = Backbone.Model.extend({
	
});

app.models.Worker = Backbone.Model.extend({
	
});

app.collections.Jobs = Backbone.Collection.extend({
	model: app.models.Job
});

app.collections.JobDescription = Backbone.Collection.extend({
	model: app.models.JobDescription,
	url: '/get_description_occupation.php'
	//url: 'description.json'
});

app.collections.Workers = Backbone.Collection.extend({
	model: app.models.Worker,
	url: '/list_tweeter_users_occupations.php'
	//url: 'list_tweeter-test.json'
});

app.views.SearchJobItem = Backbone.View.extend({
	tagName: 'li',
	
	template: _.template($('#template-search-job-item').html()),
	
	events: {
		'click .job-item': 'findJobWorkers'
	},
	
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	},
	
	findJobWorkers: function(e) {
		//var fetchWorkers = new app.collections.Workers;collection.fetch({ data: $.param({ page: 1}) });
		
		/*
		var fetchWorkers = new app.collections.Workers,
			fetchWorkers = fetchWorkers.fetch({ data: $.param({ occupation: 'chef'}) });
			console.log(fetchWorkers);*/
		var foundWorkers = new app.views.WorkerList(e);
		var showJobDescription = new app.views.JobDescription(e);
	}
});

app.views.JobDescription = Backbone.View.extend({
	tagName: 'p',
	
	template: _.template($('#template-job-description').html()),
	
	initialize: function(description) {
		_.bindAll(this, "render");
		var self = this;
		this.url_description = $(description.target).data('description');
		this.collection = new app.collections.JobDescription;

		this.collection.fetch({
			data: $.param({ url_description: this.url_description}),
			success: this.render
		});
	},
	
	render: function() {
		//this.$el.html(this.template(this.model.toJSON()));
		//this.collection.get(this.url_description);
		
		_.each(this.collection.models, function(item) {
			$('#job-description').html(item.get('description'));
		}, this);
			
		//this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});

app.views.SearchJobList = Backbone.View.extend({
	el: '#main-search-job',
	
	initialize: function(data) {
		this.collection = new app.collections.Jobs(data);
		//this.render();
		
		this.on('change:searchJob', this.filterJob, this);
		this.collection.on('reset', this.render, this);
	},
	
	events: {
		'keypress #search-job': 'searchJob',
		'blur #search-job': 'searchJobCleanse'
	},
	
	render: function() {
		var self = this;
		$('#search-job-list').empty();
		
		_.each(this.collection.models, function(job) {
			self.addJob(job);
		}, this);
	},
	
	addJob: function(job) {
		var li = new app.views.SearchJobItem({
			model: job
		});
		$('#search-job-list').append(li.render().el);
	},
	
	searchJob: function(e) {
		this.searchJob = e.target.value;
		
		if (this.searchJob.length > 1) {
			this.trigger('change:searchJob');
		}
		
	},
	
	searchJobCleanse: function() {
		if (!$('#search-job').val().length) {
			
			this.collection.reset();
			$('#search-job-list').empty();
		}
	},
	
	filterJob: function() {
		this.collection.reset(dataJobs, {silent: true});
		var filterJob = this.searchJob,
			filtered = _.filter(this.collection.models, function(item) {
				return item.get('occupation').toLowerCase().indexOf(filterJob.toLowerCase()) !== -1;	
			});
		this.collection.reset(filtered);
	}
});

app.views.WorkerItem = Backbone.View.extend({
	tagName: 'div',
	
	className: 'uk-width-medium-1-5 uk-text-center uk-row-first',
	
	template: _.template($('#template-worker-item').html()),
	
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});

app.views.WorkerList = Backbone.View.extend({
	el: '#worker-list',
	
	initialize: function(job) {
		_.bindAll(this, "render");
		var self = this;
		this.job = $(job.target).data('occupation');
		this.collection = new app.collections.Workers;

		console.log(this.job);
		console.log(encodeURIComponent(this.job));
		console.log(encodeURIComponent(this.job).replace(/%20/g,'+'));
		//console.log(decodeURI(this.job);
console.log(this.collection);
		this.collection.fetch({
			data: $.param({ occupation: (this.job)}),
			success: this.render
		});
	},
	
	render: function() {
		var self = this;
		$('#worker-list').empty();

		/*
		this.collection.each(function(model){
		  //console.log(model); 
		//	this.addWorkers(model);
		});
		*/
		
		_.each(this.collection.models, function(worker) {
			console.log(worker);
			self.addWorkers(worker);
		}, this);
	},
	
	addWorkers: function(worker) {
		var view = new app.views.WorkerItem({
			model: worker
		});
		$('#worker-list').append(view.render().el);
	}
});

app.init();