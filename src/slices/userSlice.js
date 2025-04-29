import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        id: '',
        name: '',
        token: '',
        image: ''
    },
    reducers: {
    
        updateUser: function(state, action){
            
            const user = action.payload
            if (user.id){
                state.id = user.id;
            }
            
            if (user.image){
                state.image = user.image;
            }
            if (user.token){
                state.token = user.token;
            }
            
            if (user.name){
                state.name = user.name;
            }
        },
    },
});

export const {updateUser} = userSlice.actions;

export default userSlice.reducer;