import Image from "next/image";
import React from "react";


export default function About() {
  return (
    <section className="about-us">
      {/* Hero Image */}
      <div className="container-fluid p-0">
        <Image
          loading="lazy"
          className="w-100 h-auto d-block"
          src="/assets/images/about/about.jpg"
          alt="image"
          width={1500}
          height={550}
        />
      </div>

      {/* Main Content */}
      <div className="container mt-5 pt-5">
        <div className="mw-930">
          <h2 className="page-title text-center pt-4 fw-lighter">
            OUR ARABIC PERFUMES: INSPIRED BY TRADITIONS, MADE BY HANDS
          </h2>
          <p className="fs-5 text-center">
            For more than 20 years, Ahmed Al Maghribi Perfumes is a brand that
            has continued to encapsulate the Arabic cultural heritage in the
            finest collection of Arabic perfumes. In today’s era of
            technological innovation, our brand sets itself apart by keeping the
            traditional Arabic perfume making process alive – purely made by
            hands, using the highest quality and all natural ingredients. OVER
            THE YEARS, WE HAVE CONTINUED TO PERSEVERE TO MAKE THE BEST ARABIC
            PERFUMES IN DUBAI We have crafted a first-class selection of
            perfumes, including Dehn Al Oud, Arabian oud, Eau De Parfum, and
            exclusive perfumes for women and men. Our collection offers you a
            diverse array of scents, from delightful and charming, sensational
            and sophisticated, to earthy and spicy fragrances. Made from
            carefully selected raw materials, each of our original products
            produces a lingering scent that rejuvenates the mind and body while
            soothing the senses. Also part of our product line is a selection of
            Bakhoor home fragrances with complementary oils for creating a cozy,
            relaxing and aromatic ambience within your home. Welcome your family
            and friends into a refreshing and fragrant home, with one of our
            signature Bakhoor fragrances.
          </p>
        </div>

        <div className="row align-items-center pt-5">
          {/* Left Side - Image */}
          <div className="col-lg-6 mb-4 mb-lg-0">
            <Image
              src="/assets/images/about/about3.png"
              alt="Description of image"
              width={600} // Adjust the width as needed
              height={600} // Adjust the height as needed
              className="img-fluid"
            />
          </div>

          {/* Right Side - Text */}
          <div className="col-lg-6 pt-5 mt-5 text-center text-lg-start">
            <h4 className="fs-2 pt-5 mt-5">Ahmed Al Maghribi Perfumes</h4>
            <p className="fs-5">
              First started as a hobby of its founder - Mr. Kafeel Ahmed. His
              passion for perfume making was so intense that it has evolved into
              being one of the most loved perfume brands in the region. During
              this 20 years plus journey, a lot of new fragrances have come into
              existence. However, the ones that they initially started with, are
              even today of key essence.
            </p>
            <p className="mt-3 fs-5">
              The love for fragrance creation has been extended by creating
              occasion specific perfumes, it's just like wearing different
              attires depending on the place and occasion one intends to attend.
              Our perfumes are produced by maintaining a close work relationship
              with the local community. Some people know exactly what they want
              and that helps us create personalized fragrances for them. Also,
              we set ourselves apart from the approach of creating perfumes that
              follow fashion. Our approach is strongly based on culture and
              tradition. We understand that perfumes have strongly impacted the
              Arabic culture. For example, Oud and musk are fragrances loved by
              the prophet according to the Arabic tradition.
            </p>
            <p className="mt-3 fs-5">
              Our business is closely knit as one family working together. We
              believe this is important for our company as it helps us align and
              nurture the core values of our business.
            </p>
          </div>
        </div>

        <div className="row mt-5 pt-5">
          {/* Left Side - Text */}
          <div className="col-lg-6 mb-4 mb-lg-0 text-center text-lg-start">
            <h4 className="mb-4 fs-2">Since 20+ Years</h4>
            <p className="fs-5">
              Quality is of prime importance at Al Maghribi Perfumes. We
              consider taking the same approach to fragrances that connoisseurs
              take. Careful consideration is given when bringing together
              different elements that emit exquisite aromas. At each stage of
              our production process, we have austere quality control checks
              that ensure our lofty benchmarks are being met.
            </p>
            <p className="mt-3 fs-5">
              In order to conserve the traditional feel in our fragrances, all
              of our perfumes are handmade. Machines are hardly part of our
              creation process. We do not believe in modernizing the way in
              which perfumes are created, as for us culture and tradition are of
              great value and importance. This is how our perfumes distinguish
              themselves from the mass-produced ones available in the market
              today.
            </p>
          </div>

          {/* Right Side - Video */}
          <div className="col-lg-6 text-center">
            <div className="embed-responsive embed-responsive-16by9">
              <video
                className="embed-responsive-item"
                src="/assets/images/about/shop.mp4" // Replace with your video URL
                autoPlay
                loop
                muted
                width="100%"
                height="auto"
              ></video>
            </div>
          </div>
        </div>

        {/* Image Section */}
        <section className="image-section py-5 pt-5">
          <div className="container-fluid p-0 pt-5">
            <div className="row justify-content-center align-items-center">
              {/* Image 1 */}
              <div className="col-md-4 text-center mb-4 mb-md-0">
                <div
                  className="d-flex justify-content-center align-items-center mx-auto"
                  style={{ width: "150px", height: "150px" }}
                >
                  <Image
                    src="/assets/images/about/icon1.png"
                    alt="Sample Image 1"
                    width={300}
                    height={300}
                    className="img-fluid"
                  />
                </div>
                <h4 className="fw-bold mt-3">Fragrance</h4>
                <p className="text-muted">
                  Made from carefully selected raw materials
                </p>
              </div>

              {/* Image 2 */}
              <div className="col-md-4 text-center mb-4 mb-md-0">
                <div
                  className="d-flex justify-content-center align-items-center mx-auto"
                  style={{ width: "150px", height: "150px" }}
                >
                  <Image
                    src="/assets/images/about/icon2.png"
                    alt="Sample Image 2"
                    width={300}
                    height={300}
                    className="img-fluid"
                  />
                </div>
                <h4 className="fw-bold mt-3">Quality</h4>
                <p className="text-muted">
                  Over the years, we have continued to persevere to make the
                  best Arabic perfumes in Dubai
                </p>
              </div>

              {/* Image 3 */}
              <div className="col-md-4 text-center">
                <div
                  className="d-flex justify-content-center align-items-center mx-auto"
                  style={{ width: "150px", height: "150px" }}
                >
                  <Image
                    src="/assets/images/about/icon3.png"
                    alt="Sample Image 3"
                    width={300}
                    height={300}
                    className="img-fluid"
                  />
                </div>
                <h4 className="fw-bold mt-3">Natural</h4>
                <p className="text-muted">
                  Products made by hands, using the highest quality and all
                  natural ingredients
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Mobile Footer Section */}
      {/* <section className="testsect d-sm-block d-md-none bg-dark pt-5">
            <div className="MobileFooter"></div>
          </section> */}
    </section>
  );
}
