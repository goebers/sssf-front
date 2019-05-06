import React, { Component } from 'react';
import AuthService from '../services/AuthService';
import CookieService from '../services/CookieService';
import axios from 'axios';

// auth service confid
const auth = new AuthService();

// cookies service config
const cookies = new CookieService();

class Recipes extends Component {
    constructor(props) {
        super(props);

        this.state = {
            allRecipes: [],
            searchText: '',
            newTitle: '',
            newDescription: '',
            newImage: ''
        }

        // new recipe form binds
        this.newRecipeSubmit = this.newRecipeSubmit.bind(this);
        this.titleOnChange = this.titleOnChange.bind(this);
        this.descOnChange = this.descOnChange.bind(this);
        this.imgOnChange = this.imgOnChange.bind(this);
        this.newRecipeSubmit = this.newRecipeSubmit.bind(this);

        // logout function bind
        this.logOut = this.logOut.bind(this);
    };

    componentDidMount() {
        auth.isLoggedIn().then( (result) => {
            if(!result.data.isTokenValid) {
                this.props.history.push('/');
            }
        });

        axios.get(this.BASE_URL + 'recipes/all', this.HEADERS).then( (recipes) => {
            this.setState({ allRecipes: recipes.data });
        });
    };

    /** axios constants */
    BASE_URL = 'https://env-9926568.jelastic.metropolia.fi/';

    HEADERS = {
        headers: {
            'access-token': cookies.getCookie('token')
        }
    };

    newRecipeSubmit(e) {
        e.preventDefault();

        console.log(e.target);

        // construct form data
        let formData = new FormData();

        formData.append('title', this.state.newTitle);
        formData.append('description', this.state.newDescription);
        formData.append('image', this.state.newImage);
        formData.append('userId', cookies.getCookie('userId'));

        console.log(formData);

        const config = {
            headers: {
                'content-type': 'multipart/form-data',
                'access-token': cookies.getCookie('token')
            }
        };

        axios.post(this.BASE_URL+'recipes/new', formData, config).then((result => {
            console.log(result);

            axios.get(this.BASE_URL + 'recipes/all', this.HEADERS).then( (recipes) => {
                this.setState({ allRecipes: recipes.data });
            });
        }));
    }

    titleOnChange(e) {
        this.setState({ newTitle: e.target.value });
    }

    descOnChange(e) {
        this.setState({ newDescription: e.target.value });
    }

    imgOnChange(e) {
        this.setState({ newImage: e.target.files[0] });
    }

    logOut() {
        cookies.removeCookie('token');
        cookies.removeCookie('userId');
        
        this.props.history.push('/');
    }

    render() {
        return (
            <div>

                <button onClick={this.logOut}>LOG OUT</button>
                
                <h1>Post new recipe</h1>

                <form id="recipeForm" className="form login-form" onSubmit={this.newRecipeSubmit}>
                    <label>
                        Title:<br/>
                        <input type="text" name="title" onChange={this.titleOnChange} value={this.state.newTitle} />
                    </label><br/>

                    <label>
                        Description:<br/>
                        <textarea style={{height: '150px'}} type="text" name="description" onChange={this.descOnChange} value={this.state.newDescription} />
                    </label><br/>

                    <label>
                        Image:<br/>
                        <input type="file" accept="image/png, image/jpeg" name="image" onChange={this.imgOnChange} />
                    </label><br/>

                    <button type="submit">Submit</button>
                </form>
                
                <h1>All recipes</h1>
                
                <ol>
                    {this.state.allRecipes.map( recipe => {
                        return <div key={recipe._id} onClick={this.openRecipe}>
                            <h2>{recipe.title}</h2>
                            <h3>{recipe.description}</h3>
                            <img src={this.BASE_URL + recipe.image} alt='' />
                        </div>
                    })}
                </ol>
            </div>
        );
    };
};

export default Recipes;
