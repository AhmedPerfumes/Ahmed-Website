import Image from "next/image";
import React from "react";

export default function SizeGuide() {
  return (
    <div className="modal fade" id="sizeGuide" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog size-guide">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Size Guide</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="size-guide__wrapper">
              <div className="size-guide__image">
                <Image
                  width={400}
                  height={511}
                  style={{ height: "fit-content" }}
                  loading="lazy"
                  src="/assets/images/size-guide.jpg"
                  alt="image"
                />
              </div>
             
            </div>
          </div>
        </div>
      </div>
      {/* <!-- /.modal-dialog --> */}
    </div>
  );
}
