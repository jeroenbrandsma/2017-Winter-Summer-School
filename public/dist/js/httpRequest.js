/**
 *
 * @param {String} requestType
 * @param $event
 * @param {function} callback
 */

var httpRequest = function (requestType, $event, callback) {
	var requestToString = function (requestType) {
		switch (requestType) {
			case 'post':
				return 'add';
			case 'put' :
				return 'edit';
			case 'get' :
				return 'retrieve';
			default    :
				return requestType;
		}
	};


	var data = $($event.target).data();
	var entityType = data.entityType;
	var reload = data.reload;
	delete data.reload;
	delete data.entityType;

	if (requestType === 'get' || confirm('Are you sure you want to ' + requestToString(requestType) + ' this ' +
			entityType + '?')) {
		$.ajax({
			url: '/API/' + entityType,
			type: requestType,
			data: data,
			success: function (result) {
				if (callback) {
					callback();
				} else if (reload) {
					location.reload();
				} else {
					// TODO: display nice message
					console.log(result);
				}
			},
			error: function () {
				alert('Error: could not ' + requestToString(requestType) + ' ' + entityType + '.');
			}
		});
	}

};