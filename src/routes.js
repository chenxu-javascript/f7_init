import route from "@/pages/home";
import NotFoundPage from "@/pages/notfound";

export default [{
    path: "/",
    redirect: "/route"
  },
  {
    path: "",
    redirect: "/route"
  },
  {
    path: "/route",
    component: route
  },
  {
    path: "(.*)",
    component: NotFoundPage
  }
];