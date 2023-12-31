import React from 'react';
import { withRouter, Switch, Route, Redirect } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import Base from './components/Layout/Base';
import BasePage from './components/Layout/BasePage';
// import BaseHorizontal from './components/Layout/BaseHorizontal';

import DashboardV1 from './components/Dashboard/DashboardV1';
import DashboardV2 from './components/Dashboard/DashboardV2';
import DashboardV3 from './components/Dashboard/DashboardV3';

import Widgets from './components/Widgets/Widgets';

import Buttons from './components/Elements/Buttons';
import Notifications from './components/Elements/Notifications';
import SweetAlert from './components/Elements/SweetAlert';
import BsCarousel from './components/Elements/Carousel';
import Spinner from './components/Elements/Spinner';
import DropdownAnimation from './components/Elements/DropdownAnimation';
import Nestable from './components/Elements/Nestable';
import Sortable from './components/Elements/Sortable';
import Cards from './components/Elements/Cards';
import Grid from './components/Elements/Grid';
import GridMasonry from './components/Elements/GridMasonry';
import Typography from './components/Elements/Typography';
import FontIcons from './components/Elements/FontIcons';
import WeatherIcons from './components/Elements/WeatherIcons';
import Colors from './components/Elements/Colors';

import ChartFlot from './components/Charts/ChartFlot';
import ChartRadial from './components/Charts/ChartRadial';
import ChartChartJS from './components/Charts/ChartChartJS';
import ChartMorris from './components/Charts/ChartMorris';
import ChartChartist from './components/Charts/ChartChartist';

import MapsGoogle from './components/Maps/MapsGoogle';
import MapsVector from './components/Maps/MapsVector';

import TableStandard from './components/Tables/TableStandard';
import TableExtended from './components/Tables/TableExtended';
import Datatable from './components/Tables/DatatableView';
import DataGrid from './components/Tables/DataGrid';

import FormStandard from './components/Forms/FormStandard';
import FormExtended from './components/Forms/FormExtended';
import FormValidation from './components/Forms/FormValidation';
import FormWizard from './components/Forms/FormWizard';
import FormUpload from './components/Forms/FormUpload';
import FormCropper from './components/Forms/FormCropper';

import Login from './components/Pages/Login';
import Register from './components/Pages/Register';
import Recover from './components/Pages/Recover';
import Lock from './components/Pages/Lock';
import NotFound from './components/Pages/NotFound';
import Error500 from './components/Pages/Error500';
import Maintenance from './components/Pages/Maintenance';

import Mailbox from './components/Extras/Mailbox';
import Timeline from './components/Extras/Timeline';
import Calendar from './components/Extras/Calendar';
import Invoice from './components/Extras/Invoice';
import Search from './components/Extras/Search';
import Todo from './components/Extras/Todo';
import Profile from './components/Extras/Profile';
import BugTracker from './components/Extras/BugTracker';
import ContactDetails from './components/Extras/ContactDetails';
import Contacts from './components/Extras/Contacts';
import Faq from './components/Extras/Faq';
import FileManager from './components/Extras/FileManager';
import Followers from './components/Extras/Followers';
import HelpCenter from './components/Extras/HelpCenter';
import Plans from './components/Extras/Plans';
import ProjectDetails from './components/Extras/ProjectDetails';
import Projects from './components/Extras/Projects';
import Settings from './components/Extras/Settings';
import SocialBoard from './components/Extras/SocialBoard';
import TeamViewer from './components/Extras/TeamViewer';
import VoteLinks from './components/Extras/VoteLinks';

import EcommerceOrder from './components/Ecommerce/EcommerceOrders';
import EcommerceOrderView from './components/Ecommerce/EcommerceOrderView';
import EcommerceProduct from './components/Ecommerce/EcommerceProducts';
import EcommerceProductView from './components/Ecommerce/EcommerceProductView';
import EcommerceCheckout from './components/Ecommerce/EcommerceCheckout';

import BlogList from './components/Blog/BlogList';
import BlogPost from './components/Blog/BlogPost';
import BlogArticle from './components/Blog/BlogArticles';
import BlogArticleView from './components/Blog/BlogArticleView';

import ForumHome from './components/Forum/ForumHome';


// List of routes that uses the page layout
// listed here to Switch between layouts
// depending on the current pathname
const listofPages = [
    '/login',
    '/register',
    '/recover',
    '/lock',
    '/notfound',
    '/error500',
    '/maintenance'
];

const Routes = ({ location }) => {
    const currentKey = location.pathname.split('/')[1] || '/';
    const timeout = { enter: 500, exit: 500 };

    // Animations supported
    //      'rag-fadeIn'
    //      'rag-fadeInRight'
    //      'rag-fadeInLeft'

    const animationName = 'rag-fadeIn'

    if(listofPages.indexOf(location.pathname) > -1) {
        return (
            // Page Layout component wrapper
            <BasePage>
                <Switch location={location}>
                    <Route path="/login" component={Login}/>
                    <Route path="/register" component={Register}/>
                    <Route path="/recover" component={Recover}/>
                    <Route path="/lock" component={Lock}/>
                    <Route path="/notfound" component={NotFound}/>
                    <Route path="/error500" component={Error500}/>
                    <Route path="/maintenance" component={Maintenance}/>
                </Switch>
            </BasePage>
        )
    }
    else {
        return (
            // Layout component wrapper
            // Use <BaseHorizontal> to change layout
            <Base>
              <TransitionGroup>
                <CSSTransition key={currentKey} timeout={timeout} classNames={animationName} exit={false}>
                    <div>
                        <Switch location={location}>

                            {/*Dashboard*/}
                            <Route path="/dashboardv1" component={DashboardV1}/>
                            <Route path="/dashboardv2" component={DashboardV2}/>
                            <Route path="/dashboardv3" component={DashboardV3}/>

                            {/*Widgets*/}
                            <Route path="/widgets" component={Widgets}/>

                            {/*Elements*/}
                            <Route path="/buttons" component={Buttons}/>
                            <Route path="/notifications" component={Notifications}/>
                            <Route path="/sweetalert" component={SweetAlert}/>
                            <Route path="/carousel" component={BsCarousel}/>
                            <Route path="/spinners" component={Spinner}/>
                            <Route path="/dropdown" component={DropdownAnimation}/>
                            <Route path="/nestable" component={Nestable}/>
                            <Route path="/sortable" component={Sortable}/>
                            <Route path="/cards" component={Cards}/>
                            <Route path="/grid" component={Grid}/>
                            <Route path="/grid-masonry" component={GridMasonry}/>
                            <Route path="/typography" component={Typography}/>
                            <Route path="/icons-font" component={FontIcons}/>
                            <Route path="/icons-weather" component={WeatherIcons}/>
                            <Route path="/colors" component={Colors}/>

                            {/*Forms*/}
                            <Route path="/form-standard" component={FormStandard}/>
                            <Route path="/form-extended" component={FormExtended}/>
                            <Route path="/form-validation" component={FormValidation}/>
                            <Route path="/form-wizard" component={FormWizard}/>
                            <Route path="/form-upload" component={FormUpload}/>
                            <Route path="/form-cropper" component={FormCropper}/>

                            {/*Charts*/}
                            <Route path="/chart-flot" component={ChartFlot}/>
                            <Route path="/chart-radial" component={ChartRadial}/>
                            <Route path="/chart-chartjs" component={ChartChartJS}/>
                            <Route path="/chart-morris" component={ChartMorris}/>
                            <Route path="/chart-chartist" component={ChartChartist}/>

                            {/*Table*/}
                            <Route path="/table-standard" component={TableStandard}/>
                            <Route path="/table-extended" component={TableExtended}/>
                            <Route path="/table-datatable" component={Datatable}/>
                            <Route path="/table-datagrid" component={DataGrid}/>

                            {/*Maps*/}
                            <Route path="/map-google" component={MapsGoogle}/>
                            <Route path="/map-vector" component={MapsVector}/>

                            {/*Extras*/}
                            <Route path="/mailbox" component={Mailbox}/>
                            <Route path="/timeline" component={Timeline}/>
                            <Route path="/calendar" component={Calendar}/>
                            <Route path="/invoice" component={Invoice}/>
                            <Route path="/search" component={Search}/>
                            <Route path="/todo" component={Todo}/>
                            <Route path="/profile" component={Profile}/>
                            <Route path="/ecommerce-orders" component={EcommerceOrder}/>
                            <Route path="/ecommerce-order-view" component={EcommerceOrderView}/>
                            <Route path="/ecommerce-products" component={EcommerceProduct}/>
                            <Route path="/ecommerce-product-view" component={EcommerceProductView}/>
                            <Route path="/ecommerce-checkout" component={EcommerceCheckout}/>
                            <Route path="/blog-list" component={BlogList}/>
                            <Route path="/blog-post" component={BlogPost}/>
                            <Route path="/blog-articles" component={BlogArticle}/>
                            <Route path="/blog-article-view" component={BlogArticleView}/>
                            <Route path="/bug-tracker" component={BugTracker}/>
                            <Route path="/contact-details" component={ContactDetails}/>
                            <Route path="/contacts" component={Contacts}/>
                            <Route path="/faq" component={Faq}/>
                            <Route path="/file-manager" component={FileManager}/>
                            <Route path="/followers" component={Followers}/>
                            <Route path="/help-center" component={HelpCenter}/>
                            <Route path="/plans" component={Plans}/>
                            <Route path="/project-details" component={ProjectDetails}/>
                            <Route path="/projects" component={Projects}/>
                            <Route path="/settings" component={Settings}/>
                            <Route path="/social-board" component={SocialBoard}/>
                            <Route path="/team-viewer" component={TeamViewer}/>
                            <Route path="/vote-links" component={VoteLinks}/>

                            <Route path="/forum" component={ForumHome}/>

                            <Redirect to="/dashboard"/>
                        </Switch>
                    </div>
                </CSSTransition>
              </TransitionGroup>
            </Base>
        )
    }
}

export default withRouter(Routes);