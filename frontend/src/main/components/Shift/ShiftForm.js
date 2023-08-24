import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';

function ShiftForm({ initialContents, submitAction, buttonLabel = "Create" }) {

    // Stryker disable all
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm(
        { defaultValues: initialContents || {}, }
    );
    // Stryker restore all

    const navigate = useNavigate();

    // Stryker disable next-line regex
    const time_regex = /^(0?[1-9]|1[0-2]):[0-5][0-9](AM|PM)$/;  // replace "0-2" with "012"

    const testIdPrefix = "ShiftForm";

    return(

        <Form onSubmit={handleSubmit(submitAction)}>

            {initialContents && (
                <Form.Group className="mb-3" >
                    <Form.Label htmlFor="id">Id</Form.Label>
                    <Form.Control
                        data-testid={testIdPrefix + "-id"}
                        id="id"
                        type="text"
                        {...register("id")}
                        value={initialContents.id}
                        disabled
                    />
                </Form.Group>
            )}

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="day">Day of Week</Form.Label>
                <Form.Select
                    data-testid={testIdPrefix + "-day"}
                    id="day"
                    isInvalid={Boolean(errors.day)}
                    {...register("day", {
                        required: "Day is required",
                    })}
                >
                <option value="">Select a Day</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                    {errors.day?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="shiftStart">Start Time</Form.Label>
                <Form.Control 
                    data-testid={testIdPrefix + "-shiftStart"}
                    id="shiftStart"
                    type="text"
                    isInvalid={Boolean(errors.shiftStart)}
                    {...register("shiftStart", {
                        required: "Start time is required",
                        pattern: {
                            value: time_regex,
                            message: "Start time must be in the format HH:MM AM or PM, e.g. 3:30PM"
                        },
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.shiftStart?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="shiftEnd">End Time</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-shiftEnd"}
                    id="shiftEnd"
                    type="text"
                    isInvalid={Boolean(errors.shiftEnd)}
                    {...register("shiftEnd", {
                        required: "End time is required",
                        pattern: {
                            value: time_regex,
                            message: "End time must be in the format HH:MM AM or PM, e.g. 1:30PM"
                        },
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.shiftEnd?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="driverID">Driver ID</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-driverID"}
                    id="driverID"
                    type="text"
                    isInvalid={Boolean(errors.driverID)}
                    {...register("driverID", {
                        required: "Driver ID is required"
                    })}
                    placeholder="e.g. 123"
                />
                <Form.Control.Feedback type="invalid">
                    {errors.driverID?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="driverBackupID">Backup Driver ID</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-driverBackupID"}
                    id="driverBackupID"
                    type="text"
                    isInvalid={Boolean(errors.driverBackupID)}
                    {...register("driverBackupID", {
                        required: "Backup Driver's ID is required"
                    })}
                    placeholder="e.g. 456"
                />
                <Form.Control.Feedback type="invalid">
                    {errors.driverBackupID?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Button
                type="submit"
                data-testid={testIdPrefix + "-submit"}
            >
                {buttonLabel}
            </Button>

            <Button
                variant="Secondary"
                onClick={() => navigate(-1)}
                data-testid={testIdPrefix + "-cancel"}
            >
                Cancel
            </Button>

        </Form>
    )
}

export default ShiftForm;