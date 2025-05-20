
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Software Engineer",
    content: "SeedIQ completely changed my approach to learning. The AI tutor helped me solve complex problems that I struggled with for months. I was able to advance in my career thanks to the skills I gained here.",
    image: "/placeholder.svg",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Data Scientist",
    content: "The data science course on SeedIQ was more comprehensive than any other online course I've taken. The community support was exceptional, and I could always get my questions answered promptly.",
    image: "/placeholder.svg",
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    role: "UX Designer",
    content: "As someone transitioning careers, SeedIQ provided exactly what I needed. The structured learning paths helped me acquire the necessary skills step by step. Now I'm confidently working in my dream role.",
    image: "/placeholder.svg",
  },
  {
    id: 4,
    name: "James Wilson",
    role: "Product Manager",
    content: "The AI tutor on SeedIQ feels like having a personal mentor available 24/7. It helped me grasp difficult concepts quickly and efficiently, making my learning journey much smoother.",
    image: "/placeholder.svg",
  },
];

const Testimonials = () => {
  return (
    <div className="bg-gray-50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">What Our Learners Say</h2>
          <p className="text-xl text-gray-700">
            Thousands of learners have transformed their lives through SeedIQ. Here are some of their stories.
          </p>
        </div>

        <div className="mt-12">
          <Carousel opts={{ loop: true }}>
            <CarouselContent>
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id} className="sm:basis-1/2 lg:basis-1/3 pl-4">
                  <div className="bg-white p-6 rounded-xl shadow-md h-full flex flex-col">
                    <div className="mb-6">
                      <svg className="h-8 w-8 text-seediq-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                    </div>
                    <p className="text-gray-700 flex-grow mb-6">{testimonial.content}</p>
                    <div className="flex items-center">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="h-12 w-12 rounded-full mr-4"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                        <p className="text-gray-600 text-sm">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center gap-2 mt-8">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
