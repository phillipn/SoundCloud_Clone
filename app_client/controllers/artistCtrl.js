angular.module('soundcloud')
  .controller('artistCtrl', ['$scope', '$rootScope', 'contentFactory', '$location','$routeParams','$cacheFactory','authFactory', function($scope, $rootScope, contentFactory, $location, $routeParams, $cacheFactory, authFactory){
    $scope.artist_id = $routeParams.id;
    $scope.artist_songs = [];
    $scope.artist_albums = [];
    $scope.artist_name = '';
    // if id does not exist when we search for username redirect to stream
    contentFactory.getArtist($scope.artist_id).then(function(response){
      $scope.artist_name = response.data.username
    })
    contentFactory.getArtistSongs($scope.artist_id).then(function(response){
      $scope.artist_songs = response.data;

      var trackPaths = [];
      var songNames = [];
      var song_ids = [];

      for (var i = 0; i < $scope.artist_songs.length; i++) {
        trackPaths.push($scope.artist_songs[i].audio)
        songNames.push($scope.artist_songs[i].name);
        song_ids.push($scope.artist_songs[i]._id);
      }

      $rootScope.$emit('addArtistSongs', {
        songs: trackPaths,
        names: songNames,
        song_ids: song_ids
      });
    })

    contentFactory.getArtistAlbums($scope.artist_id).then(function(response){
      $scope.artist_albums = response.data;
    })
    $scope.likeSong = function(song_id, index){
      contentFactory.likeSong(song_id).then(function(response){
        $scope.artist_songs[index].userLikes.push($scope.user._id);
      })
    }
    if(angular.isUndefined($cacheFactory.get('userCache'))){
      $cacheFactory('userCache')
    }
    if($cacheFactory.get('userCache').get('user')){
      $scope.user = $cacheFactory.get('userCache').get('user');
    } else {
      authFactory.getCurrentUser().then(function(response){
        if(response.data){
          $scope.user = response.data;
        }
      }).catch(function(err){
        console.log(err);
      })
    }
  }])
