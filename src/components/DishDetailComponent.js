
import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle, Breadcrumb, BreadcrumbItem, Button, Label, Col, Row, Collapse, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { Link } from 'react-router-dom'
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Loading, LOADING } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';
    
    function RenderDish({dish}){
        if(dish != null){
            return(
                <div className="col-12 col-md-5 m-1">
                    <FadeTransform in 
                        transformProps = {{
                            exitTransform: "scale(0.5) translateY(-50%)"
                        }}    
                    >
                        <Card>
                        <CardImg width="100%" src={baseUrl + dish.image} alt={dish.name} />
                        <CardBody>
                            <CardTitle>{dish.name}</CardTitle>
                            <CardText>{dish.description}</CardText>
                        </CardBody>
                    </Card>
                    </FadeTransform>
                </div>
            );
        }
        else{
            return(
               <div></div>
            );
        }
    }

    function RenderComments({ comments, postComment, dishId }){
        // console.log(comments);
        if(comments!=null){
            const cmnts = comments.map(
                (c) => (
                            <Fade in>
                                <li key={c.id}>
                                <p>{c.comment}</p>
                                <p>--{c.author},&nbsp;
                                {new Intl.DateTimeFormat("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "2-digit",
                                    }).format(new Date(Date.parse(c.date)))}
                                </p>
                                </li>
                            </Fade>
            )); 
            return(
                <div className="col-12 col-md-5 m-1">
                    <h4>Comments</h4>
                    <ul className="list-unstyled">
                        <Stagger in>
                            {cmnts}
                        </Stagger>
                    </ul>
                    <CommentForm dishId={dishId} postComment={postComment} />
                </div>
            );
        }
        else{
            return(
                <div></div>
            );
        }
    }

        
    const required = (val) => val && val.length;
    const maxLength = (len) => (val) => !val || val.length <= len;
    const minLength = (len) => (val) => val && val.length >= len;

    class CommentForm extends Component{
        constructor(props){
            super(props);

            this.state = {
                isModalOpen: false
            }

            this.toggleModal = this.toggleModal.bind(this);
            this.handleSubmit = this.handleSubmit.bind(this);
        }

        toggleModal(){
            this.setState({
                isModalOpen: !this.state.isModalOpen
            })
        }

        handleSubmit(values) {
            this.toggleModal();
            this.props.postComment(this.props.dishId, values.rating, values.author, values.comment)
        }

        render(){
            return(      
                <React.Fragment>
                    <Button outline onClick={this.toggleModal}>
                        <span className="fa fa-pencil fa-lg"></span>Submit Comment
                    </Button>
                    <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                        <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
                        <ModalBody>
                            <LocalForm onSubmit={this.handleSubmit}>
                                <Row className="form-group">
                                    <Label htmlFor="rating" md={12}>Rating</Label>
                                    <Col md={12}>
                                        <Control.select model=".rating" name="rating"
                                            className="form-control">
                                            <option>1</option>
                                            <option>2</option>
                                            <option>3</option>
                                            <option>4</option>
                                            <option>5</option>
                                        </Control.select>
                                    </Col>
                                </Row>

                                <Row className="form-group">
                                    <Label htmlFor="author" md={12}>Your Name</Label>
                                    <Col md={12}>
                                        <Control.text model=".author" id="author" name="author"
                                            placeholder="Your Name"
                                            validators={{
                                                required,
                                                minLength: minLength(3),
                                                maxLength: maxLength(15),
                                            }}   
                                        />
                                        <Errors
                                            className="text-danger"
                                            model=".author"
                                            show="touched"
                                            messages={{
                                            required: "Required",
                                            minLength: "Must be greater than 2 characters",
                                            maxLength: "Must be 15 characters or less",
                                            }}
                                        />
                                    </Col>
                                </Row>

                                <Row className="form-group">
                                    <Label htmlFor="comment" md={12}>
                                    Comment
                                    </Label>
                                    <Col md={12}>
                                    <Control.textarea model=".comment" id="comment" name="comment"
                                        rows={6}
                                        className="form-control"
                                    />
                                    </Col>
                                </Row>

                                <Button type="submit" value="submit" color="primary">
                                    Submit
                                </Button>
                            </LocalForm>
                        </ModalBody>
                    </Modal>
                </React.Fragment>
            );
        }
    }

    class DishDetail extends Component{

        constructor(props){
            super(props);
        }

        render(){
            if(this.props.isLoading){
                return(
                    <div className="container">
                        <div className="row">
                            <Loading />
                        </div>
                    </div>
                );
            }
            else if(this.props.errMess){
                return(
                    <div className="container">
                        <div className="row">
                            <h4>{this.props.errMess}</h4>
                        </div>
                    </div>
                );
            }

            else if(this.props.dish!=null){
                return(
                    <div className="container">
                        <div className="row">
                            <Breadcrumb>
                                <BreadcrumbItem><Link to='/menu'>Menu</Link></BreadcrumbItem>
                                <BreadcrumbItem active>{this.props.dish.name}</BreadcrumbItem>
                            </Breadcrumb>
                            <div className="col-12">
                                <h3>{this.props.dish.name}</h3>
                                <hr/>
                            </div>
                        </div>
                            <div className="row">
                                <RenderDish dish={this.props.dish} />
                                <RenderComments comments={this.props.comments} postComment={this.props.postComment}
                                    dishId={this.props.dish.id}
                                />
                            </div>
                    </div>
                );
            }
            else{
                return(
                    <div></div>
                );
            }
            // console.log("DishDetail component rendor is invoked");
        }
    }

export default DishDetail;
