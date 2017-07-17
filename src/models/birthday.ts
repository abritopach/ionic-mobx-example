import { observable, computed } from 'mobx-angular';

export class Birthday {
    id: string;
    /*
     As you can see I've decorated name and date with @observable. These values can be changed by the user and because
     of the @observable decorator, MobX knows that it needs to track changes on these properties.
     */
    @observable name: string;
    @observable date: string;

    constructor() { }

    /*
     Date will contain the birthday date in ISO format, but we'll need it as an actual Date object later on, so I've
     created a @computed property for it.

     This means that every time the date value changes, MobX will automatically update the value of parsedDate.
     */
    @computed get parsedDate(): Date {
        return new Date(this.date);
    }

}