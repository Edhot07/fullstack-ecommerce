import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Terms and conditions for using our services",
};

export default function Page() {
  return (
    <main className="mx-auto max-w-4xl space-y-10 px-5 py-10 leading-7">
      <div className="mx-auto text-center">
        <h2 className="py-5 text-3xl">CUSTOMER CARE</h2>
        <p>
        We are committed to providing excellent customer service. If you have any questions or concerns, feel free to contact us. Our team is here to assist you with orders, returns, and any inquiries regarding our products.
        </p>
        <p>
          {/* Sed ut perspiciatis unde omnis iste natus error sit voluptatem
          accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae
          ab illo inventore veritatis et quasi architecto beatae vitae dicta
          sunt explicabo. */}
        </p>
        <h2 className="mt-10 py-5 text-3xl">PRIVACY & SAFETY</h2>
        <p>
        Your privacy is important to us. We ensure that your personal information is protected and used only for order processing and customer support. We do not share your data with third parties without your consent.
        </p>
        <p>
          {/* Sed ut perspiciatis unde omnis iste natus error sit voluptatem
          accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae
          ab illo inventore veritatis et quasi architecto beatae vitae dicta
          sunt explicabo. */}
        </p>
        <h2 className="mt-10 py-5 text-3xl">WHOLESALE INQUIRIES</h2>
        <p>
        For bulk purchases and wholesale inquiries, please reach out to us. We offer competitive pricing and tailored solutions for bulk orders.
        </p>
        <p>
          {/* Sed ut perspiciatis unde omnis iste natus error sit voluptatem
          accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae
          ab illo inventore veritatis et quasi architecto beatae vitae dicta
          sunt explicabo. */}
        </p>
        <h2 className="mt-10 py-5 text-3xl">PAYMENT METHODS</h2>
        <p>
          - Credit / Debit Cards
          <br /> - PAYPAL
          <br /> - Offline Payments
        </p>
      </div>
    </main>
  );
}