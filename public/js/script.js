//Main Dashboard "Component"
var DashboardBox = React.createClass({
    getInitialState: function() {
        return {
            buttonLabel: "Look for Gunther",
            buttonAction: this.search,
            actionButtonClass: "btn-primary btn-block g-btn-master",
            batteryLevel: 'N/A',
            inAir: false,
            controlsVisibility: 'hidden',
            availableDrones: []
        };
    },
    componentDidMount: function(){
      setInterval(this.fetchGuntherStatus, 5000);
    },
    fetchGuntherStatus: function(){
      $.ajax({
        url: '/gunther/get/status',
        dataType: 'json',
        cache: false,
        success: function(data) {
          if(inAir && !data.flying){
            this.setState({
              inAir: false,
              batteryLevel: data.battery,
              flyLandLabel: 'Take Off',
              droneStatus: 'Gunther has crashed. You may have to reconnect.',
              flyStateAction: this.takeoff,
              flyLandStateClass: 'btn-block g-btn-fly',
              flyButtonClass: ''
            });
          }else{
            this.setState({
              batteryLevel: data.battery,
            });
          }
        }.bind(this),
        error: function(xhr, status, err) {
          this.setState({
            batteryLevel: 'N/A',
          });
        }.bind(this)
      });
    },
    search: function() {
        this.setState({
          droneStatus: 'Looking for Gunther...',
          actionButtonClass: 'disabled btn-block g-btn-master',
          availableDrones: []
        });
        $.ajax({
          url: this.props.url + '/search',
          dataType: 'json',
          cache: false,
          success: function(data) {
            this.setState({
              droneStatus: 'Drone(s) found. Click on your\'s to connect.',
              availableDrones: data
            });
          }.bind(this),
          complete: function(){
            this.setState({actionButtonClass: 'btn-block g-btn-master'});
          }.bind(this),
          error: function(xhr, status, err) {
            this.setState({
              droneStatus: 'Could not find Gunther. Is he awake?',
              buttonLabel: 'Look for Gunther',
              buttonAction: this.search,
              availableDrones: []
            });
          }.bind(this)
        });
    },
    connect: function(uuid) {
      this.setState({ droneStatus: 'Connecting to Gunther...'});
        $.ajax({
          url: this.props.url + '/connect',
          type:'post',
          data:{uuid: uuid},
          dataType: 'json',
          cache: false,
          success: function(data) {
            this.setState({
              inAir: false,
              buttonLabel: 'Disconnect',
              flyLandLabel: 'Take Off',
              flyStateAction: this.takeoff,
              flyLandStateClass: 'btn-block g-btn-fly',
              actionButtonClass: 'btn-block g-btn-die',
              buttonAction: this.disconnect,
              droneStatus: 'Connected to Gunther!',
              controlsVisibility: 'showing',
              availableDrones: []
            });
          }.bind(this),
          error: function(xhr, status, err) {
          }.bind(this)
        });
    },
    disconnect: function(){
      $.ajax({
        url: this.props.url + '/disconnect',
        dataType: 'json',
        cache: false,
        complete: function(data) {
          this.setState({
            buttonLabel: 'Look for Gunther',
            buttonAction: this.search,
            droneStatus: 'Disconnected from Gunther.',
            actionButtonClass: 'btn-block g-btn-master',
            controlsVisibility: 'hidden',
            availableDrones: []
          });
        }.bind(this),
        error: function(xhr, status, err) {
        }.bind(this)
      });
    },
    takeoff: function() {
      this.setState({
        inAir: true,
        flyButtonClass: 'disabled',
        droneStatus: 'Gunther is taking off!',
      })
        $.ajax({
          url: this.props.url + '/takeoff',
          dataType: 'json',
          cache: false,
          success: function(data) {
            this.setState({
              flyLandLabel: 'Land',
              droneStatus: 'Gunther is airborne!',
              flyStateAction: this.land,
              flyLandStateClass: 'btn-block g-btn-land',
              flyButtonClass: ''
            })
          }.bind(this),
          error: function(xhr, status, err) {
          }.bind(this)
        });
    },
    land: function() {
      this.setState({flyButtonClass: 'disabled'})
        $.ajax({
          url: this.props.url + '/land',
          dataType: 'json',
          cache: false,
          success: function(data) {
            this.setState({
              flyLandLabel: 'Take Off',
              droneStatus: 'Gunther has landed.',
              flyStateAction: this.takeoff,
              flyLandStateClass: 'btn-block g-btn-fly',
              flyButtonClass: ''
            })
          }.bind(this),
          error: function(xhr, status, err) {
          }.bind(this)
        });
    },
    die: function() {
      this.setState({
        flyButtonClass: 'disabled',
        droneStatus: 'Abandon ship! Gunther is crash landing!',
      })
        $.ajax({
          url: this.props.url + '/die',
          dataType: 'json',
          cache: false,
          complete: function(data) {
            this.setState({
              flyLandLabel: 'Take Off',
              droneStatus: 'Gunther has crashed. You may have to reconnect.',
              flyStateAction: this.takeoff,
              flyLandStateClass: 'btn-block g-btn-fly',
              flyButtonClass: ''
            })
          }.bind(this),
          error: function(xhr, status, err) {
          }.bind(this)
        });
    },
    ascend: function() {
      this.setState({
        flyButtonClass: 'disabled',
        droneStatus: 'Gunther is climbing',
      })
        $.ajax({
          url: this.props.url + '/ascend',
          dataType: 'json',
          cache: false,
          complete: function(data) {
            this.setState({
              droneStatus: 'Gunther has leveled off.',
              flyButtonClass: ''
            })
          }.bind(this),
          error: function(xhr, status, err) {
          }.bind(this)
        });
    },
    descend: function() {
      this.setState({
        flyButtonClass: 'disabled',
        droneStatus: 'Gunther is descending',
      })
        $.ajax({
          url: this.props.url + '/descend',
          dataType: 'json',
          cache: false,
          complete: function(data) {
            this.setState({
              droneStatus: 'Gunther has leveled off.',
              flyButtonClass: ''
            })
          }.bind(this),
          error: function(xhr, status, err) {
          }.bind(this)
        });
    },
    forward: function() {
      this.setState({
        flyButtonClass: 'disabled',
        droneStatus: 'Gunther is moving ahead',
      })
        $.ajax({
          url: this.props.url + '/forward',
          dataType: 'json',
          cache: false,
          complete: function(data) {
            this.setState({
              droneStatus: 'Gunther is now hovering.',
              flyButtonClass: ''
            })
          }.bind(this),
          error: function(xhr, status, err) {
          }.bind(this)
        });
    },
    backward: function() {
      this.setState({
        flyButtonClass: 'disabled',
        droneStatus: 'Gunther is moving backwards',
      })
        $.ajax({
          url: this.props.url + '/backward',
          dataType: 'json',
          cache: false,
          complete: function(data) {
            this.setState({
              droneStatus: 'Gunther is now hovering.',
              flyButtonClass: ''
            })
          }.bind(this),
          error: function(xhr, status, err) {
          }.bind(this)
        });
    },
    strafeLeft: function() {
      this.setState({
        flyButtonClass: 'disabled',
        droneStatus: 'Gunther is strafing left',
      })
        $.ajax({
          url: this.props.url + '/strafe/left',
          dataType: 'json',
          cache: false,
          complete: function(data) {
            this.setState({
              droneStatus: 'Gunther is now hovering.',
              flyButtonClass: ''
            })
          }.bind(this),
          error: function(xhr, status, err) {
          }.bind(this)
        });
    },
    strafeRight: function() {
      this.setState({
        flyButtonClass: 'disabled',
        droneStatus: 'Gunther is strafing right',
      })
        $.ajax({
          url: this.props.url + '/strafe/right',
          dataType: 'json',
          cache: false,
          complete: function(data) {
            this.setState({
              droneStatus: 'Gunther is now hovering.',
              flyButtonClass: ''
            })
          }.bind(this),
          error: function(xhr, status, err) {
          }.bind(this)
        });
    },
    turnLeft: function() {
      this.setState({
        flyButtonClass: 'disabled',
        droneStatus: 'Gunther is turning 45 degrees to the left',
      })
        $.ajax({
          url: this.props.url + '/turn/left',
          dataType: 'json',
          cache: false,
          complete: function(data) {
            this.setState({
              droneStatus: 'Gunther is now hovering.',
              flyButtonClass: ''
            })
          }.bind(this),
          error: function(xhr, status, err) {
          }.bind(this)
        });
    },
    turnRight: function() {
      this.setState({
        flyButtonClass: 'disabled',
        droneStatus: 'Gunther is turning 45 degrees to the right',
      })
        $.ajax({
          url: this.props.url + '/turn/right',
          dataType: 'json',
          cache: false,
          complete: function(data) {
            this.setState({
              droneStatus: 'Gunther is now hovering.',
              flyButtonClass: ''
            })
          }.bind(this),
          error: function(xhr, status, err) {
          }.bind(this)
        });
    },
    frontFlip: function() {
      this.setState({
        flyButtonClass: 'disabled',
        droneStatus: 'Gunther doing a front flip!',
      })
        $.ajax({
          url: this.props.url + '/flip/front',
          dataType: 'json',
          cache: false,
          complete: function(data) {
            this.setState({
              droneStatus: 'Gunther is now hovering.',
              flyButtonClass: ''
            })
          }.bind(this),
          error: function(xhr, status, err) {
          }.bind(this)
        });
    },
    backFlip: function() {
      this.setState({
        flyButtonClass: 'disabled',
        droneStatus: 'Gunther doing a back flip!',
      })
        $.ajax({
          url: this.props.url + '/flip/back',
          dataType: 'json',
          cache: false,
          complete: function(data) {
            this.setState({
              droneStatus: 'Gunther is now hovering.',
              flyButtonClass: ''
            })
          }.bind(this),
          error: function(xhr, status, err) {
          }.bind(this)
        });
    },
    leftFlip: function() {
      this.setState({
        flyButtonClass: 'disabled',
        droneStatus: 'Gunther is flipping to the left!',
      })
        $.ajax({
          url: this.props.url + '/flip/left',
          dataType: 'json',
          cache: false,
          complete: function(data) {
            this.setState({
              droneStatus: 'Gunther is now hovering.',
              flyButtonClass: ''
            })
          }.bind(this),
          error: function(xhr, status, err) {
          }.bind(this)
        });
    },
    rightFlip: function() {
      this.setState({
        flyButtonClass: 'disabled',
        droneStatus: 'Gunther is flipping to the right!',
      })
        $.ajax({
          url: this.props.url + '/flip/right',
          dataType: 'json',
          cache: false,
          complete: function(data) {
            this.setState({
              droneStatus: 'Gunther is now hovering.',
              flyButtonClass: ''
            })
          }.bind(this),
          error: function(xhr, status, err) {
          }.bind(this)
        });
    },
    render: function() {
        return (
            <div>
              <div className="row">
                  <div className="col-md-4 col-md-offset-4">
                      <ActionButton onClick={this.state.buttonAction} className={this.state.actionButtonClass} label={this.state.buttonLabel} />
                  </div>
              </div>
              <div className="row">
                <div className="drone-status col-md-6 col-md-offset-3 text-center">
                  <DroneConsole statusLabel={this.state.droneStatus} />
                </div>
              </div>
              <div className="row">
                <DroneList drones={this.state.availableDrones} handleClick={this.connect} />
              </div>
              <div className={(this.state.controlsVisibility || '') + " master-control-wrapper"} >
                <div className="row essential-controls">
                  <div className="col-md-4">
                    <h4 className="text-center">Battery Level: {this.state.batteryLevel}</h4>
                  </div>
                  <div className="col-md-4">
                    <ActionButton onClick={this.state.flyStateAction} className={this.state.flyLandStateClass} label={this.state.flyLandLabel} />
                  </div>
                  <div className="col-md-2 col-md-offset-2">
                    <ActionButton onClick={this.die} className="btn btn-block g-btn-die" label="Kill Switch" />
                  </div>
                </div>
                <div className="row controls-wrapper">
                  <div className="col-md-6">
                    <h3 className="text-center">Basic Controls</h3>
                    <div className="row control-row top-control-row">
                        <div className="col-md-4 col-md-offset-2">
                          <ActionButton onClick={this.ascend} className={(this.state.flyButtonClass || '') + " btn btn-block g-btn-top-two"} label="Ascend" />
                        </div>
                        <div className="col-md-4">
                          <ActionButton onClick={this.descend} className={(this.state.flyButtonClass || '') + " btn btn-block g-btn-top-two"} label="Descend" />
                        </div>
                    </div>
                    <div className="row control-row">
                      <div className="col-md-4 col-md-offset-4">
                        <ActionButton onClick={this.forward} className={(this.state.flyButtonClass || '') + " btn btn-block g-btn-basic-control"} label="Forward" />
                      </div>
                    </div>
                    <div className="row control-row">
                      <div className="col-md-4 col-md-offset-2">
                        <ActionButton onClick={this.strafeLeft} className={(this.state.flyButtonClass || '') + " btn btn-block g-btn-basic-control"} label="Strafe Left" />
                      </div>
                      <div className="col-md-4">
                        <ActionButton onClick={this.strafeRight} className={(this.state.flyButtonClass || '') + " btn btn-block g-btn-basic-control"} label="Strafe Right" />
                      </div>
                    </div>
                    <div className="row control-row">
                      <div className="col-md-4 col-md-offset-4">
                        <ActionButton onClick={this.backward} className={(this.state.flyButtonClass || '') + " btn btn-block g-btn-basic-control"} label="Backward" />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h3 className="text-center">Special Maneuvers</h3>
                    <div className="row control-row top-control-row">
                        <div className="col-md-4 col-md-offset-2">
                          <ActionButton onClick={this.turnLeft} className={(this.state.flyButtonClass || '') + " btn btn-block g-btn-top-two"} label="Turn Left" />
                        </div>
                        <div className="col-md-4">
                          <ActionButton onClick={this.turnRight} className={(this.state.flyButtonClass || '') + " btn btn-block g-btn-top-two"} label="Turn Right" />
                        </div>
                    </div>
                    <div className="row control-row">
                      <div className="col-md-4 col-md-offset-4">
                        <ActionButton onClick={this.frontFlip} className={(this.state.flyButtonClass || '') + " btn btn-block g-btn-basic-control"} label="Front Flip" />
                      </div>
                    </div>
                    <div className="row control-row">
                        <div className="col-md-4 col-md-offset-2">
                          <ActionButton onClick={this.leftFlip} className={(this.state.flyButtonClass || '') + " btn btn-block g-btn-basic-control"} label="Left Flip" />
                        </div>
                        <div className="col-md-4">
                          <ActionButton onClick={this.rightFlip} className={(this.state.flyButtonClass || '') + " btn btn-block g-btn-basic-control"} label="Right Flip" />
                        </div>
                    </div>
                    <div className="row control-row">
                      <div className="col-md-4 col-md-offset-4">
                        <ActionButton onClick={this.backFlip} className={(this.state.flyButtonClass || '') + " btn btn-block g-btn-basic-control"} label="Back Flip" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          </div>
        )
    }
});



//Button Component
var ActionButton = React.createClass({
    render: function() {
        return(
            <button onClick={this.props.onClick} className={'btn ' + (this.props.className || '')}>{this.props.label}</button>
        )
    }
});

//Shows relevant information about what is happening to drone
var DroneConsole = React.createClass({
    render: function() {
        return(
            <h4>{(this.props.statusLabel || '')}</h4>
        )
    }
});

//Shows DroneList
var DroneList = React.createClass({
  handleClick: function(id){
    this.props.handleClick(id);
  },
  render: function() {
    return (
      <div className="list-group text-center col-md-6 col-md-offset-3">
        {this.props.drones.map(function(drone, i) {
          var boundClick = this.handleClick.bind(this, drone.uuid);
          return (
            <Drone onClick={boundClick} key={i} name={drone.name} uuid={drone.uuid} />
          );
        }, this)}
      </div>
    );
  }
});

//Single Drone
var Drone = React.createClass({
  render: function() {
    return(
      <li className="drone-candidate list-group-item" onClick={this.props.onClick}>
        <b>{this.props.name}</b> - {this.props.uuid}
      </li>
    )
  }
})


//Complete Render
React.render(<DashboardBox url="/gunther"/>, document.getElementById('dashboard'));