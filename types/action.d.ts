interface SigninWithOauthParams {
    provider : google | facebook ;
    providerAccountId : string;
    user : {
        name: string;
        email?: string;
        image?: string;
    };
}

interface AuthCredentials {
    email: string;
    name: string;
    confirmPassword: string;
    password: string;
}