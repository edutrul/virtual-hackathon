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

app.collections.Jobs = Backbone.Collection.extend({
	model: app.models.Job
});

app.views.SearchJobItem = Backbone.View.extend({
	tagName: 'li',
	
	template: _.template($('#template-search-job-item').html()),
	
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
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
		this.trigger('change:searchJob');
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
				return item.get('title').toLowerCase().indexOf(filterJob.toLowerCase()) !== -1;
			});
		this.collection.reset(filtered);
	}

});

app.init();