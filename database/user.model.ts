import {model , models , Schema , Document} from 'mongoose';


export interface IUser {
    name: string;
    email: string;
    image?: string;
    role?: string;
    password?: string;
    passwordRestToken?: string; 
    passwordRestExpires?: Date; 
}

export interface IUserDocument extends IUser, Document {}

const userSchema = new Schema<IUser> ({
    name : {type: String, required: true},
    email : {type: String, required: true, unique: true},
    password : {type: String, required: false}, 
    passwordRestToken : {type: String, required: false},
    passwordRestExpires : {type: Date, required: false},
    image : {type: String},
    role : {type: String, default: 'user'},
}, {
    timestamps: true
})

const User = models?.User || model<IUser>('User', userSchema);

export default User;