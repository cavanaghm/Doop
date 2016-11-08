angular
	.module('app')
	.config(function($stateProvider) {
		$stateProvider
			.state('users-edit', {
				url: '/users/:id',
				component: 'usersEditCtrl',
				data: {
					title: 'Edit User',
					breadcrumbs: [
						{title: 'Manage Users', url: '/users'},
					],
				},
			})
	})
	.component('usersEditCtrl', {
		templateUrl: '/units/users/edit.tmpl.html',
		controller: function($scope, $location, $loader, $stateParams, $timeout, $toast, SessionServ, Users) {
			var $ctrl = this;
			$ctrl.$session = SessionServ;

			// Meta data {{{
			$ctrl.meta = {
				roles: [
					{id: 'user', title: 'User'},
					{id: 'admin', title: 'Admin'},
					{id: 'root', title: 'Root'},
				],
			};
			// }}}

			if (!$stateParams.id) return $location.path('/');

			// Data refresher {{{
			$ctrl.user;
			$ctrl.refresh = function() {
				$loader.start($scope.$id, $ctrl.user === undefined);

				Users.get({id: $stateParams.id}).$promise
					.then(data => $ctrl.user = data)
					.catch($toast.catch)
					.finally(() => $loader.stop($scope.$id));
			};
			// }}}

			// Save {{{
			$ctrl.save = function() {
				$loader.start($scope.$id);
				Users.save({id: $stateParams.id}, $ctrl.user).$promise
					.then(_=> $toast.success('User details saved'))
					.then(_=> $location.path('/users'))
					.catch($toast.catch)
					.finally(() => $loader.stop($scope.$id));
			};
			// }}}

			$scope.$evalAsync($ctrl.refresh);
		},
	});