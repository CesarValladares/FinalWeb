export class Rent {

    constructor(_id = '', date_init = '', date_end = '', status = '', client = '', book = ''){
        this._id=_id;
        this.date_init = date_init;
        this.date_end = date_end;
        this.status = status;
        this.client = client;
        this.book = book;
    }

    public _id: string;
    public date_init: string;
    public date_end: string;
    public status: string;
    public client: string;
    public book: string;
}
