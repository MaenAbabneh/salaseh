import {model , models , Schema , Types , Document} from 'mongoose';

export interface IAccount {
    userId : Types.ObjectId;
    name : string;
    image? : string;
    provider : string;
    providerAccountId : string;
}

export interface IAccountDocument extends IAccount, Document {}

const accountSchema = new Schema<IAccountDocument>({
    userId : {type : Schema.Types.ObjectId, ref : 'User', required : true},
    name : {type : String, required : true},
    image : {type : String, required : false},
    provider : {type : String, required : true},
    providerAccountId : {type : String, required : true}
}, {
    timestamps: true
});

const Account = models?.Account || model<IAccount>('Account', accountSchema);

export default Account;