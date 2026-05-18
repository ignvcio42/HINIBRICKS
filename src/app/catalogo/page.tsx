export default function CatalogoPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <section className="w-full bg-white py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">

          {/* Título */}
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              Nuestro{" "}
              <span className="text-[#5B5BD6]">Catálogo</span>
            </h1>
            <p className="mt-3 text-base text-gray-500 sm:text-lg">
              Revisa todas las piezas disponibles para armar tu figura.
            </p>
          </div>

          {/* Embed de Canva */}
          <div className="mx-auto max-w-[900px]">
            <div
              style={{
                position: "relative",
                width: "100%",
                height: 0,
                paddingTop: "141.4286%",
                paddingBottom: 0,
                boxShadow: "0 2px 8px 0 rgba(63,69,81,0.16)",
                marginTop: "1.6em",
                marginBottom: "0.9em",
                overflow: "hidden",
                borderRadius: "8px",
                willChange: "transform",
              }}
            >
              <iframe
                loading="lazy"
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  top: 0,
                  left: 0,
                  border: "none",
                  padding: 0,
                  margin: 0,
                }}
                src="https://www.canva.com/design/DAG3F20_e4I/W7P1hHdFoSFyD9ohN5IraA/view?embed"
                allowFullScreen
                allow="fullscreen"
              />
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
