class Elevator{
    
    //#region "Constructor"
    constructor(){
        this.AMOUNT_OF_FLOOR = 3
        this.TIME_TRANSACTION_FLOOR = 2;
        this.$elevator = $('.elevator');
        this.ElevatorIsMoviment = false;
        this.AFloorQueue = [];
        this.InitButtons();
        this.InitCamera();
    }
    //#endregion

    //#region "Camera"
    InitCamera(){
        navigator.mediaDevices.getUserMedia({video: true}).then(stream =>{
            let video = this.$elevator.find('.camera')[0];
            video.srcObject = stream;
        }).catch(err => console.error(err) );
    }
    //#endregion

    //#region "Button"
    InitButtons(){
        $('.buttons .btn').on('click', e=> {
            let btn = e.target;
            let floor = $(btn).data('floor');
            
            this.EnableButton(btn)
            
            if(this.ElevatorIsMoviment || this.AFloorQueue.length > 0)
                this.AddRequestInQueue(floor);
            else
                this.ChangeFloor(floor);
        });
    }
    //#endregion

    //#region "Doors"

    //#region "Open Door"
    OpenDoor(){
        return new Promise((resolve, reject)=>{
            
            if(!this.DoorIsOpen()){
                this.$elevator.find('.door').addClass('open');
            }
            resolve();            
        });
    }
    //#endregion

    //#region "Close Door"
    CloseDoor(){
        return new Promise((resolve, reject) => {
            
            if(this.DoorIsOpen()) {
                this.$elevator.find('.door').removeClass('open');
                setTimeout(() => { resolve(); }, 1500);
            }

            resolve();
        });
    }
    //#endregion

    //#region "Door is Open"
    DoorIsOpen(){
        let doors = this.$elevator.find('.door');
        return doors.hasClass('open');
    }
    //#endregion

    //#endregion
  
    //#region "Change floor"
    ChangeFloor(number){      
        this.SetMovimentElevator(true);
        let currentFloor = this.GetCurrentFloor();
        
        this.CloseDoor().then(() => {
            new Promise((resolve, reject) => {
                if(currentFloor === number){
                    resolve();
                } else {
                    this.MoveElevator(currentFloor, number);               
                    this.TransitionEnd(() =>  resolve() );
                }   
            }).then(() => {
                this.SetDisplayFloor(number);
                this.DownInFloor(number);
            });
        });     
    }
    //#endregion

    //#region "Move Elevator"
    MoveElevator(currentFloor, number){
        this.ClearFloor();
        this.$elevator.data('floor', number);

        this.$elevator.addClass(`floor${number}`)
        this.$elevator.css('-webkit-transition-duration', `${this.GetTimeTransition(currentFloor, number)}s`)
    }
    //#endregion

    //#region "Down In Floor"
    DownInFloor(number){
        this.OpenDoor().then(() => {
            this.DisableButton($(`.button${number}`))
                                
            setTimeout(() => {   
                this.CloseDoor().then(() => {
                    this.SetMovimentElevator(false);
                    setTimeout(() => this.GetNextOfQueue() , 2000); 
                });    
            }, 3000);
        });                
    }
    //#endregion
  
    //#region "Go to next Queue"
    GetNextOfQueue(){
        if(this.AFloorQueue.length > 0){    
            let newFloor = this.AFloorQueue.shift();
            this.ChangeFloor(newFloor);
        }
    }
    //#endregion

    //#region "Add request in Queue"
    AddRequestInQueue(numberOfFloor){
        if(this.AFloorQueue.indexOf(numberOfFloor) < 1)
        this.AFloorQueue.push(numberOfFloor);
    }
    //#endregion

    //#region "Get current floor"
    GetCurrentFloor(){
        return this.$elevator.data('floor');
    }
    //#endregion

    //#region "End Transition"
    TransitionEnd(callback){
        this.$elevator.on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',
         () => { callback(); });
    }
    //#endregion

    //#region "Time of Transition"
    GetTimeTransition(currentFloor, number){
        let amountFloor = number - currentFloor;
        return amountFloor * this.TIME_TRANSACTION_FLOOR;
    }
    //#endregion

    //#region "Clear Floor"
    ClearFloor(){
        for (let i = 0; i <= this.AMOUNT_OF_FLOOR; i++) 
            this.$elevator.removeClass(`floor${i}`);   
    }
    //#endregion

    //#region "Set moviment elevator"
    SetMovimentElevator(condition){
        this.ElevatorIsMoviment = condition;
    }
    //#endregion

    //#region "Set display floor"
    SetDisplayFloor(floor){
        this.$elevator.find('.display').text(floor);
    }
    //#endregion

    //#region "Light of Buttons"
    //#region "Disable Button"
    DisableButton(button){
        $(button).removeClass('floor-selected');
    }
    //#endregion

    //#region "Enable Button"
    EnableButton(button){
        $(button).addClass('floor-selected');
    }
    //#endregion

    //#endregion

} 