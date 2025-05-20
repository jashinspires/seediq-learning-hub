
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <div className="bg-seediq-600 py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl text-seediq-100 mb-8">
            Join thousands of learners who are achieving their goals with SeedIQ's comprehensive learning platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/skillup">Browse Courses</Link>
            </Button>
            <Button size="lg" variant="default" asChild className="bg-white text-seediq-600 hover:bg-seediq-50">
              <Link to="/signup">Sign Up for Free</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;
