import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center px-6 lg:px-12">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl lg:text-7xl font-bold mb-6">Justin Baird</h1>
        <p className="text-xl lg:text-2xl text-gray-300 mb-4">Driving positive change through</p>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
          I am a Senior Product Designer and UX/UI expert with 20+ years of experience in innovation, technology,
          product, management and strategy.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-white text-black hover:bg-gray-200">About</Button>
          <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black bg-transparent">
            Contact
          </Button>
          <Button variant="ghost" className="text-white hover:bg-white/10">
            ✉ Email
          </Button>
        </div>
      </div>
    </section>
  )
}
